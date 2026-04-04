import api from './apiClient.js';

// GET /api/leave — paginated list with optional filters
export const getLeaveRequests = (params = {}) =>
  api.get('/leave', params);

// GET /api/leave/credits — current year credit allocations
export const getLeaveCredits = () =>
  api.get('/leave/credits');

// GET /api/leave/stats — stat card counts
export const getLeaveStats = () =>
  api.get('/leave/stats');

// POST /api/leave — file new leave request
export const createLeaveRequest = (payload) =>
  api.post('/leave', payload);

// PATCH /api/leave/:id/cancel — cancel pending leave
export const cancelLeaveRequest = (id) =>
  api.patch(`/leave/${id}/cancel`);
