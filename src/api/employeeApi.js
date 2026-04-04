import api from './apiClient.js';

// GET /api/employee/profile — full employee profile
export const getProfile = () =>
  api.get('/employee/profile');

// PATCH /api/employee/profile — update editable profile fields
export const updateProfile = (data) =>
  api.patch('/employee/profile', data);

// GET /api/employee/dashboard — dashboard summary data
export const getDashboard = () =>
  api.get('/employee/dashboard');

// GET /api/employee/directory — all employees for directory page
export const getDirectory = () =>
  api.get('/employee/directory');
