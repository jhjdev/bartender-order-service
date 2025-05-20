import axios from '../config/axios';
import { User } from '../types/user';

const API_URL = '/auth';
const TOKEN_KEY = 'auth_token';

export const authService = {
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: User }> {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token } = response.data;
    this.setToken(token);
    return response.data;
  },

  logout() {
    this.removeToken();
  },

  async getCurrentUser(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await axios.put(`${API_URL}/profile`, userData);
    return response.data;
  },

  initializeAuth() {
    const token = this.getToken();
    if (token) {
      if (!axios.defaults.headers.common['Authorization']) {
        this.setToken(token);
      }
      return true;
    }
    return false;
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};
