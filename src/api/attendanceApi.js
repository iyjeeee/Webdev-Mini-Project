// attendanceApi.js — Attendance API calls
// Routes to mockApiService when guest mode is active (token === 'guest').

import api from './apiClient.js';
import {
  mockGetAttendanceLogs,
  mockGetAttendanceStats,
  mockGetTodayAttendance,
  mockTimeIn,
  mockTimeOut,
} from '../data/mockApiService.js';

// Helper — detect guest mode without importing AuthContext (avoids circular deps)
const isGuest = () => localStorage.getItem('token') === 'guest';

// GET /api/attendance — paginated logs
export const getAttendanceLogs = (params = {}) =>
  isGuest() ? mockGetAttendanceLogs(params) : api.get('/attendance', params);

// GET /api/attendance/stats — monthly stat counts
export const getAttendanceStats = (params = {}) =>
  isGuest() ? mockGetAttendanceStats(params) : api.get('/attendance/stats', params);

// GET /api/attendance/today — today's log record
export const getTodayAttendance = () =>
  isGuest() ? mockGetTodayAttendance() : api.get('/attendance/today');

// POST /api/attendance/time-in — record time-in
export const timeIn = () =>
  isGuest() ? mockTimeIn() : api.post('/attendance/time-in', {});

// POST /api/attendance/time-out — record time-out
export const timeOut = () =>
  isGuest() ? mockTimeOut() : api.post('/attendance/time-out', {});
