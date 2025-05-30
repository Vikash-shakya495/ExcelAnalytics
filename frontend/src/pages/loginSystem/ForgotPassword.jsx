import { useState } from 'react';
import authService from '../../services/authService';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await authService.forgotPassword(email);
      alert('OTP sent to email');
      setOtpSent(true);
    } catch {
      alert('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await authService.verifyOtp(email, otp);
      alert('OTP verified. You can now reset your password.');
      setOtpVerified(true);
    } catch {
      alert('Invalid or expired OTP');
    }
  };

  if (!otpSent) {
    return (
      <form onSubmit={handleSendOtp}>
        <input
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
    );
  }

  if (!otpVerified) {
    return (
      <form onSubmit={handleVerifyOtp}>
        <input
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
    );
  }

  return (
    <div>
      <p>OTP verified. Please proceed to reset your password.</p>
      <a href="/reset-password">Reset Password</a>
    </div>
  );
}

export default ForgotPassword;
