import { Routes, Route, useLocation } from 'react-router-dom';
import Signup from './pages/loginSystem/Signup';
import Login from './pages/loginSystem/Login';
import ForgotPassword from './pages/loginSystem/ForgotPassword';
import ResetPassword from './pages/loginSystem/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  const location = useLocation();

  // Define the paths where you want to hide the navbar and footer
  const hideLayoutPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ];

  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}

      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route path="/" element={<Home />} />
        <Route path="adminDashboard" element={<AdminDashboard />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route
          path="userDashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!shouldHideLayout && <Footer />}
    </>
  );
}
