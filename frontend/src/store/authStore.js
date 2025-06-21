import { create } from 'zustand';
import authService from '../services/authService';


function safeParseJSON(item) {
  try {
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

const useAuthStore = create((set) => ({
  user: safeParseJSON(localStorage.getItem('user')),
  token: localStorage.getItem('token') || null,

  login: async (credentials) => {
    const res = await authService.login(credentials);
    const user = res.data;

    localStorage.setItem('user', JSON.stringify(user));
    // Token is set in httpOnly cookie by backend, no need to store in localStorage

    set({ user, token: null });
  },

  logout: async () => {
    await authService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));


export default useAuthStore;