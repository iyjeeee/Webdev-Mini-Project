import api from './apiClient.js';

// GET /api/overtime — paginated list with optional filters
export const getOvertimeRequests = (params = {}) =>
  api.get('/overtime', params);

// GET /api/overtime/stats — stat card counts
export const getOvertimeStats = () =>
  api.get('/overtime/stats');

// POST /api/overtime — file new overtime
export const createOvertimeRequest = (payload) =>
  api.post('/overtime', payload);

// PATCH /api/overtime/:id/cancel — cancel pending request
export const cancelOvertimeRequest = (id) =>
  api.patch(`/overtime/${id}/cancel`);
