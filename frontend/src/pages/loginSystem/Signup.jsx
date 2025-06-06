import { useState } from 'react';
import authService from '../../services/authService';
import useAuthStore from '../../store/authStore';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.signup(form);
      alert('Signup successful');
      await login({ email: form.email, password: form.password });

      if (form.role === 'admin') {
        navigate('/adminDashboard');
      } else {
        navigate('/userDashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Signup failed: ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white/5 rounded-2xl shadow-xl border border-white/10 backdrop-blur-lg text-white space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
          🚀 Create Your Account
        </h2>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Role</label>
          <select
            name="role"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:brightness-110 py-2 rounded-lg font-semibold shadow-lg transition"
        >
          Sign Up
        </motion.button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <NavLink to="/login" className="text-indigo-400 hover:underline">
            Login here
          </NavLink>
        </p>
      </motion.form>
    </div>
  );
}

export default Signup;
