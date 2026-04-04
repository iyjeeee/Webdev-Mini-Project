import api from './apiClient.js';

// POST /api/auth/login — returns { token, user }
export const loginApi = (email, password) =>
  api.post('/auth/login', { email, password });

// POST /api/auth/logout — invalidate session on server (optional endpoint)
export const logoutApi = () =>
  api.post('/auth/logout', {});
