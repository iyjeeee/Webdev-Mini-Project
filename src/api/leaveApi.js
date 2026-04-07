// leaveApi.js — Leave request API calls
// Routes to mockApiService when guest mode is active (token === 'guest').

import api from './apiClient.js';
import {
  mockGetLeaveRequests,
  mockGetLeaveCredits,
  mockGetLeaveStats,
  mockCreateLeaveRequest,
  mockCancelLeaveRequest,
} from '../data/mockApiService.js';

const isGuest = () => localStorage.getItem('token') === 'guest';

// GET /api/leave — paginated list with optional filters
export const getLeaveRequests = (params = {}) =>
  isGuest() ? mockGetLeaveRequests(params) : api.get('/leave', params);

// GET /api/leave/credits — current year credit allocations
export const getLeaveCredits = () =>
  isGuest() ? mockGetLeaveCredits() : api.get('/leave/credits');

// GET /api/leave/stats — stat card counts
export const getLeaveStats = () =>
  isGuest() ? mockGetLeaveStats() : api.get('/leave/stats');

// POST /api/leave — file new leave request
export const createLeaveRequest = (payload) =>
  isGuest() ? mockCreateLeaveRequest(payload) : api.post('/leave', payload);

// PATCH /api/leave/:id/cancel — cancel pending leave
export const cancelLeaveRequest = (id) =>
  isGuest() ? mockCancelLeaveRequest(id) : api.patch(`/leave/${id}/cancel`);
