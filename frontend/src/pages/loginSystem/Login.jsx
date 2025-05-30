import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.email || !form.password) {
      alert('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(form);
      alert('Logged in successfully');
      navigate('/');
    } catch (error) {
      alert('Login failed. Please check your credentials.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-4">
        <a href="/forgot-password" className="text-blue-600 hover:underline mr-4">Forgot Password?</a>
        <a href="/reset-password" className="text-blue-600 hover:underline">Reset Password</a>
      </div>
    </>
  );
}

export default Login;
