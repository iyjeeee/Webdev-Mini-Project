// overtimeApi.js — Overtime request API calls
// Routes to mockApiService when guest mode is active (token === 'guest').

import api from './apiClient.js';
import {
  mockGetOvertimeRequests,
  mockGetOvertimeStats,
  mockCreateOvertimeRequest,
  mockCancelOvertimeRequest,
} from '../data/mockApiService.js';

const isGuest = () => localStorage.getItem('token') === 'guest';

// GET /api/overtime — paginated list with optional filters
export const getOvertimeRequests = (params = {}) =>
  isGuest() ? mockGetOvertimeRequests(params) : api.get('/overtime', params);

// GET /api/overtime/stats — stat card counts
export const getOvertimeStats = () =>
  isGuest() ? mockGetOvertimeStats() : api.get('/overtime/stats');

// POST /api/overtime — file new overtime
export const createOvertimeRequest = (payload) =>
  isGuest() ? mockCreateOvertimeRequest(payload) : api.post('/overtime', payload);

// PATCH /api/overtime/:id/cancel — cancel pending request
export const cancelOvertimeRequest = (id) =>
  isGuest() ? mockCancelOvertimeRequest(id) : api.patch(`/overtime/${id}/cancel`);
