import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuthStore();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Logged in but wrong role
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}