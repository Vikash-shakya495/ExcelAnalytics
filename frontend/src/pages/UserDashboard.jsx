import useAuthStore from '../store/authStore';

export default function UserDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
      {user && <p className="mb-4">Welcome, {user.name}!</p>}
      <div className="p-4 bg-green-100 rounded shadow">
        <ul className="list-disc list-inside">
          <li>Upload Excel files</li>
          <li>Generate charts</li>
          <li>View analysis history</li>
        </ul>
      </div>
    </div>
  );
}
