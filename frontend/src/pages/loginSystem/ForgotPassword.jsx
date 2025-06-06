import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../../services/authService';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      alert('OTP sent to email');
      setOtpSent(true);
    } catch {
      alert('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyOtp(email, otp);
      alert('OTP verified. You can now reset your password.');
      setOtpVerified(true);
    } catch {
      alert('Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
      {!otpSent && (
        <motion.form
          onSubmit={handleSendOtp}
          className="w-full max-w-md p-8 bg-white/5 rounded-2xl shadow-xl border border-white/10 backdrop-blur-lg text-white space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
            🔒 Forgot Password
          </h2>
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:brightness-110 py-2 rounded-lg font-semibold shadow-lg transition disabled:opacity-60"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
          <p className="text-sm text-center text-gray-400">
            Remembered your password?{" "}
            <NavLink to="/login" className="text-indigo-400 hover:underline">
              Login here
            </NavLink>
          </p>
        </motion.form>
      )}

      {otpSent && !otpVerified && (
        <motion.form
          onSubmit={handleVerifyOtp}
          className="w-full max-w-md p-8 bg-white/5 rounded-2xl shadow-xl border border-white/10 backdrop-blur-lg text-white space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
            🔑 Verify OTP
          </h2>
          <div>
            <label className="block mb-1 text-sm text-gray-300">OTP</label>
            <input
              name="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:brightness-110 py-2 rounded-lg font-semibold shadow-lg transition disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </motion.form>
      )}

      {otpVerified && (
        <motion.div
          className="w-full max-w-md p-8 bg-white/5 rounded-2xl shadow-xl border border-white/10 backdrop-blur-lg text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-6 text-lg">OTP verified successfully! You can now reset your password.</p>
          <NavLink
            to="/reset-password"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-lg font-semibold shadow-lg hover:brightness-110 transition"
          >
            Reset Password
          </NavLink>
        </motion.div>
      )}
    </div>
  );
}

export default ForgotPassword;
