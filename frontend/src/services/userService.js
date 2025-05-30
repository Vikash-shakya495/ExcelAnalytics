import api from './api';

const getUserProfile = () => api.get('/auth/profile');
const updateUserProfile = (data) => api.put('/user/profile', data);

export default {
  getUserProfile,
  updateUserProfile,
};
