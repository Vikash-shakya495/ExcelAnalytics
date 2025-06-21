import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import userService from '../services/userService';
import useAuthStore from '../store/authStore';

export default function ProfileUpdate() {
  const updateUser = useAuthStore((state) => state.updateUser);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (profile.password && profile.password !== profile.confirmPassword) {
      setError('🔒 Passwords do not match. Try again!');
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        name: profile.name,
        email: profile.email,
      };
      if (profile.password) updateData.password = profile.password;

      const updatedUser = await userService.updateProfile(updateData);
      updateUser(updatedUser);
      setSuccess('✅ Profile updated successfully!');
      setProfile({ ...profile, password: '', confirmPassword: '' });
    } catch {
      setError('❌ Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-br from-[#1c013b] to-[#0e001f] text-white p-8 rounded-2xl border border-purple-800 shadow-2xl backdrop-blur-md transition-all">
      <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-400 via-pink-600 to-indigo-500 bg-clip-text text-transparent">
        ✨ Update Your Profile
      </h2>

      <p className="text-sm text-purple-300 mb-6 text-center">
        Keep your information updated to personalize your experience. You can also change your password for better security.
      </p>

      {error && (
        <div className="flex items-center gap-2 bg-red-900/30 text-red-400 border border-red-600 px-4 py-3 rounded-md mb-5 text-sm">
          <FiXCircle /> {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 bg-green-900/30 text-green-400 border border-green-600 px-4 py-3 rounded-md mb-5 text-sm">
          <FiCheckCircle /> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <FiUser className="absolute left-3 top-3 text-purple-400" />
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
          />
        </div>

        <div className="relative">
          <FiMail className="absolute left-3 top-3 text-purple-400" />
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
          />
        </div>

        <div className="relative">
          <FiLock className="absolute left-3 top-3 text-purple-400" />
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
          />
        </div>

        <div className="relative">
          <FiLock className="absolute left-3 top-3 text-purple-400" />
          <input
            type="password"
            name="confirmPassword"
            value={profile.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔄 Updating...' : '🚀 Save Changes'}
        </button>
      </form>

      <div className="mt-6 text-xs text-purple-400 text-center">
        🔐 Your data is safe and secure. Update your details regularly to stay protected.
      </div>
    </div>
  );
}
