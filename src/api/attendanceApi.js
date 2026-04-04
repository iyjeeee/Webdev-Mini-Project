import api from './apiClient.js';

// GET /api/attendance — paginated logs
export const getAttendanceLogs = (params = {}) =>
  api.get('/attendance', params);

// GET /api/attendance/stats — monthly stat counts
export const getAttendanceStats = (params = {}) =>
  api.get('/attendance/stats', params);

// GET /api/attendance/today — today's log record
export const getTodayAttendance = () =>
  api.get('/attendance/today');

// POST /api/attendance/time-in — record time-in
export const timeIn = () =>
  api.post('/attendance/time-in', {});

// POST /api/attendance/time-out — record time-out
export const timeOut = () =>
  api.post('/attendance/time-out', {});
