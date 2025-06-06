import api from './api';

const signup = (data) => api.post('/auth/signup', data);
const login = (data) => api.post('/auth/login', data, { headers: { 'Content-Type': 'application/json' } });
const sendOtp = (email) => api.post('/auth/send-otp', { email });
const verifyOtp = (email, otp) => api.post('/auth/verify-otp', { email, otp });
const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
const resetPassword = (data) => api.post('/auth/reset-password', data);
const logout = () => api.post('/auth/logout');

export default {
  signup,
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  logout,
};
