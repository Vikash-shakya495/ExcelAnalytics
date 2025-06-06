import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';  // <-- import useNavigate
import authService from '../../services/authService';

function ResetPassword() {
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // <-- initialize navigate

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
    setLoading(true);
    try {
      await authService.resetPassword(form);
      alert('Password reset successful');
      setForm({ email: '', otp: '', newPassword: '' });
      navigate('/login');  // <-- redirect to login page
    } catch (err) {
      setError('Reset failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white/5 rounded-3xl shadow-xl border border-white/20 backdrop-blur-lg text-white space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          🔄 Reset Your Password
        </h2>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Email</label>
          <input
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">OTP</label>
          <input
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">New Password</label>
          <input
            name="newPassword"
            type="password"
            placeholder="••••••••"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition"
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-60"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </motion.button>
      </motion.form>
    </div>
  );
}

export default ResetPassword;
