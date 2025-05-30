import useAuthStore from '../store/authStore';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      {user && <p className="mb-4">Welcome, {user.name}!</p>}
      <div className="p-4 bg-yellow-100 rounded shadow">
        <ul className="list-disc list-inside">
          <li>Manage users</li>
          <li>View usage statistics</li>
          <li>Handle flagged files</li>
        </ul>
      </div>
    </div>
  );
}
