const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
   const { name, email, password, role } = req.body;

   if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
   }

   try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ error: "Email already in use." });
      }

      const userDoc = await UserModel.create({
         name,
         email,
         password: bcrypt.hashSync(password, bcryptSalt),
         role,
      });

      // Exclude password from response
      const userResponse = userDoc.toObject();
      delete userResponse.password;

      res.status(201).json(userResponse);
   } catch (e) {
      console.error("Registration Error:", e);
      res.status(500).json({ error: "Registration failed" });
   }
};


exports.login = async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
   }

   try {
      const userDoc = await UserModel.findOne({ email });

      if (!userDoc) {
         return res.status(404).json({ error: "User not found" });
      }

      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (!passOk) {
         return res.status(401).json({ error: "Invalid password" });
      }

jwt.sign({ email: userDoc.email, id: userDoc._id, role: userDoc.role }, jwtSecret, {}, (err, token) => {
         if (err) return res.status(500).json({ error: "Token generation failed" });

         // Exclude password from response
         const userResponse = userDoc.toObject();
         delete userResponse.password;

         res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
         }).json(userResponse);
      });
   } catch (e) {
      console.error("Login Error:", e);
      res.status(500).json({ error: "Login failed" });
   }
};


exports.forgotPassword = async (req, res) => {
   const { email } = req.body;

   try {
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 5 * 60 * 1000;

      user.resetPasswordOtp = otp;
      user.resetPasswordOtpExpires = otpExpires;
      await user.save();

      const subject = "Password Reset OTP";
      const message = `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`;

      await sendEmail(user.email, subject, message);
      res.status(200).json({ message: "OTP sent to email" });
   } catch (e) {
      console.error("Forgot Password Error:", e);
      res.status(500).json({ error: "Failed to send OTP" });
   }
};


// Verify OTP
exports.verifyOtp = async (req, res) => {
   const { email, otp } = req.body;

   try {
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      if (user.resetPasswordOtp !== otp || Date.now() > user.resetPasswordOtpExpires) {
         return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      res.status(200).json({ message: "OTP verified. You can reset your password now." });
   } catch (e) {
      console.error("OTP Verify Error:", e);
      res.status(500).json({ error: "OTP verification failed" });
   }
};


// Reset Password
exports.resetPassword = async (req, res) => {
   const { email, otp, newPassword } = req.body;

   try {
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      if (user.resetPasswordOtp !== otp || Date.now() > user.resetPasswordOtpExpires) {
         return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      user.password = bcrypt.hashSync(newPassword, bcryptSalt);
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpires = undefined;
      await user.save();

      res.status(200).json({ message: "Password reset successfully" });
   } catch (e) {
      console.error("Reset Password Error:", e);
      res.status(500).json({ error: "Password reset failed" });
   }
};


exports.logout = (req, res) => {
   res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
   }).json(true);
};

// Add missing profile controller
exports.profile = async (req, res) => {
   try {
      // req.user is set by authMiddleware
      const user = await UserModel.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ error: "User not found" });

      res.status(200).json(user);
   } catch (e) {
      console.error("Profile Error:", e);
      res.status(500).json({ error: "Failed to fetch profile" });
   }
};
