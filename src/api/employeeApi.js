// employeeApi.js — Employee & dashboard API calls
// Routes to mockApiService when guest mode is active (token === 'guest').

import api from './apiClient.js';
import {
  mockGetProfile,
  mockUpdateProfile,
  mockGetDashboard,
  mockGetDirectory,
} from '../data/mockApiService.js';

// Helper — detect guest mode without importing AuthContext (avoids circular deps)
const isGuest = () => localStorage.getItem('token') === 'guest';

// GET /api/employee/profile — full employee profile
export const getProfile = () =>
  isGuest() ? mockGetProfile() : api.get('/employee/profile');

// PATCH /api/employee/profile — update editable profile fields
export const updateProfile = (data) =>
  isGuest() ? mockUpdateProfile(data) : api.patch('/employee/profile', data);

// GET /api/employee/dashboard — dashboard summary data
export const getDashboard = () =>
  isGuest() ? mockGetDashboard() : api.get('/employee/dashboard');

// GET /api/employee/directory — all employees for directory page
export const getDirectory = () =>
  isGuest() ? mockGetDirectory() : api.get('/employee/directory');
