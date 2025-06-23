import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FaUsers, FaFileUpload, FaServer, FaTrashAlt } from 'react-icons/fa';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchUsageStats();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      const res = await api.get('/admin/users', { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchUsageStats = async () => {
    setLoadingStats(true);
    setError(null);
    try {
      const res = await api.get('/admin/usage-stats', { withCredentials: true });
      setUsageStats(res.data);
    } catch (err) {
      setError('Failed to fetch usage statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`, { withCredentials: true });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-4 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-12 bg-white/5 backdrop-blur-md rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10">
        
        {/* Header */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-3 sm:mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🛠️ Admin Dashboard
        </motion.h2>
        
        <p className="text-center text-gray-400 mb-6 sm:mb-8">
          Manage users, view platform activity, and stay on top of system metrics.
        </p>

        {user && (
          <motion.div
            className="text-center mb-8 sm:mb-10 text-base sm:text-lg text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Welcome, <span className="text-white font-semibold">{user.name}</span> 🧑‍💼
          </motion.div>
        )}

        {error && (
          <motion.div
            className="bg-red-500/20 text-red-400 font-medium px-4 py-3 mb-6 rounded-xl shadow-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Section Divider */}
        <hr className="my-8 sm:my-10 border-white/10" />

        {/* User Management Section */}
        <motion.section
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <FaUsers className="text-green-400 text-lg sm:text-xl" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white">User Management</h3>
          </div>

          {loadingUsers ? (
            <p className="text-center text-gray-400">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-center italic text-gray-500">No users found.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-h-80 sm:max-h-96 overflow-y-auto pr-2">
              {users.map((u) => (
                <motion.li
                  key={u._id}
                  className="flex justify-between items-center p-3 sm:p-4 bg-white/10 rounded-xl shadow hover:shadow-xl transition-transform hover:scale-[1.02]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div>
                    <p className="font-semibold text-white text-sm sm:text-base">{u.name}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{u.email} · Role: {u.role}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="ml-3 sm:ml-4 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:brightness-110 shadow-md flex items-center gap-1 sm:gap-2"
                  >
                    <FaTrashAlt className="text-sm sm:text-base" /> Delete
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.section>

        {/* Section Divider */}
        <hr className="my-8 sm:my-10 border-white/10" />

        {/* Usage Statistics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <FaFileUpload className="text-blue-400 text-lg sm:text-xl" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Usage Statistics</h3>
          </div>

          {loadingStats ? (
            <p className="text-center text-gray-400">Loading usage statistics...</p>
          ) : usageStats ? (
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 bg-white/10 p-4 sm:p-6 rounded-2xl shadow-md border border-white/10">
              <div className="p-3 sm:p-4 bg-black/20 rounded-xl text-white space-y-1 shadow">
                <p className="text-base sm:text-lg font-medium">
                  👥 Total Users:
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">
                  {usageStats.totalUsers}
                </p>
              </div>

              <div className="p-3 sm:p-4 bg-black/20 rounded-xl text-white space-y-1 shadow">
                <p className="text-base sm:text-lg font-medium">
                  📁 Total Uploads:
                </p>
                <p className="text-xl sm:text-2xl font-bold text-blue-400">
                  {usageStats.totalUploads}
                </p>
              </div>

             <div className="sm:col-span-2">
  <h4 className="flex items-center gap-2 font-semibold mb-4 text-indigo-400 text-lg">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 animate-pulse text-pink-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    Recent Uploads
  </h4>

  <ul className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-900 p-4 bg-gradient-to-br from-black/30 to-black/60 rounded-2xl border border-indigo-700 text-gray-300 text-sm shadow-lg">
    {usageStats.recentUploads.length === 0 ? (
      <li className="text-center italic text-gray-500 select-none">No uploads yet.</li>
    ) : (
      usageStats.recentUploads.map((upload) => (
        <li
          key={upload._id}
          className="flex justify-between items-center mb-3 p-2 rounded-lg hover:bg-indigo-800/50 transition cursor-default"
          title={`${upload.originalname} — uploaded on ${new Date(upload.uploadDate).toLocaleString()}`}
        >
          <span className="truncate max-w-[60%] font-medium text-indigo-300">
            📄 {upload.originalname}
          </span>
          <time className="text-xs text-indigo-400 whitespace-nowrap ml-4">
            {new Date(upload.uploadDate).toLocaleString()}
          </time>
        </li>
      ))
    )}
  </ul>
</div>

            </div>
          ) : (
            <p className="text-center text-gray-500 italic">No usage statistics available.</p>
          )}
        </motion.section>

        {/* Section Divider */}
        <hr className="my-8 sm:my-10 border-white/10" />

        {/* System Info Placeholder Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FaServer className="text-purple-400 text-xl" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white">System Overview (Coming Soon)</h3>
          </div>
          <p className="text-gray-400">
            Charts, error logs, server status, and system health metrics will be available soon.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
