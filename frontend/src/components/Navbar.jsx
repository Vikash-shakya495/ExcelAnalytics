// components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout(); // call logout from zustand store
    navigate('/login'); // redirect to login
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">Excel Analytics</Link>

      <div className="space-x-4">
        {user ? (
          <>
            <Link to={user.role === 'admin' ? '/adminDashboard' : '/userDashboard'}>
              {user.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
