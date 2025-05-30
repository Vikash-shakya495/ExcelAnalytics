import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

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
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      {user && <p className="mb-4">Welcome, {user.name}!</p>}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">User Management</h3>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul className="divide-y divide-gray-200 border rounded max-h-64 overflow-auto">
            {users.map((u) => (
              <li key={u._id} className="flex justify-between items-center p-2">
                <span>{u.name} ({u.email}) - Role: {u.role}</span>
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Usage Statistics</h3>
        {loadingStats ? (
          <p>Loading usage statistics...</p>
        ) : usageStats ? (
          <div className="space-y-2">
            <p>Total Users: {usageStats.totalUsers}</p>
            <p>Total Uploads: {usageStats.totalUploads}</p>
            <div>
              <h4 className="font-semibold">Recent Uploads:</h4>
              <ul className="list-disc list-inside max-h-40 overflow-auto border rounded p-2">
                {usageStats.recentUploads.map((upload) => (
                  <li key={upload._id}>
                    {upload.originalname} - {new Date(upload.uploadDate).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>No usage statistics available.</p>
        )}
      </section>
    </div>
  );
}
