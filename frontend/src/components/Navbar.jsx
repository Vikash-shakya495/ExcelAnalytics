import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
        >
          Excel Analytics
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 text-sm font-medium">
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/adminDashboard' : '/userDashboard'}
                className="hover:text-blue-400 transition-colors duration-200"
              >
                {user.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-700 rounded-lg text-white hover:brightness-110 transition-all shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:text-green-400 transition-colors duration-200"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
