import { useState } from 'react';
import authService from '../../services/authService';

function ResetPassword() {
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.otp || !form.newPassword) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      await authService.resetPassword(form);
      alert('Password reset successful');
    } catch (err) {
      setError('Reset failed. Please check your inputs.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="otp"
        placeholder="OTP"
        value={form.otp}
        onChange={handleChange}
        required
      />
      <input
        name="newPassword"
        placeholder="New Password"
        type="password"
        value={form.newPassword}
        onChange={handleChange}
        required
      />
      <button type="submit">Reset Password</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default ResetPassword;
