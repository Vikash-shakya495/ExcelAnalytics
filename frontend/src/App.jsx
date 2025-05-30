import { Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout';
import Signup from './pages/loginSystem/Signup';
import Login from './pages/loginSystem/Login';
import ForgotPassword from './pages/loginSystem/ForgotPassword';
import ResetPassword from './pages/loginSystem/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route path="/" element={<Home />} />
        <Route path="adminDashboard" element={<AdminDashboard />} />
        <Route path="userDashboard" element={<UserDashboard />} />
      </Routes>
      <Footer />
    </>
  );
}
