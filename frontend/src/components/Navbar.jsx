import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 drop-shadow-sm"
        >
          Excel Analytics
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 sm:space-x-6 text-white text-xs sm:text-sm font-medium">
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/adminDashboard' : '/userDashboard'}
                className="flex items-center space-x-1 sm:space-x-2 hover:text-purple-300 transition duration-200"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xs sm:text-base">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span>{user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-xl shadow-md text-white hover:scale-105 hover:shadow-lg transition-all duration-200 text-xs sm:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-0.5 sm:px-4 sm:py-1 rounded-md bg-white/10 border border-white/20 hover:bg-white/20 transition text-white text-xs sm:text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-0.5 sm:px-4 sm:py-1 rounded-md bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-110 text-white shadow-md transition text-xs sm:text-sm"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Toggle */}
        <div className="md:hidden text-white">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden backdrop-blur-xl bg-black/50 border-t border-white/10 px-4 pb-3 pt-1 text-white space-y-3 text-center">
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/adminDashboard' : '/userDashboard'}
                className="block hover:text-purple-300 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-700 rounded-xl shadow-md text-white hover:brightness-110 transition text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-1.5 bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition text-white text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-1.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-md hover:brightness-110 text-white shadow-md transition text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
