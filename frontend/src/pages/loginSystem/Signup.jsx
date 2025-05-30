import { useState } from 'react';
import authService from '../../services/authService';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.signup(form);
      alert('Signup successful');
      // Automatically login after signup
      await login({ email: form.email, password: form.password });
      // Navigate to dashboard based on role
      if (form.role === 'admin') {
        navigate('/adminDashboard');
      } else {
        navigate('/userDashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Signup failed: ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <select name="role" onChange={handleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
