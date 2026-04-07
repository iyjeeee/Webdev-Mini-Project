// eventTypeApi.js — Event type API calls
// Routes to mockApiService when guest mode is active (token === 'guest').

import api from './apiClient.js';
import {
  mockGetEventTypes,
  mockGetEventTypeStats,
  mockCreateEventType,
  mockToggleEventType,
} from '../data/mockApiService.js';

const isGuest = () => localStorage.getItem('token') === 'guest';

// GET /api/event-types — paginated list
export const getEventTypes = (params = {}) =>
  isGuest() ? mockGetEventTypes(params) : api.get('/event-types', params);

// GET /api/event-types/stats — stat card counts
export const getEventTypeStats = () =>
  isGuest() ? mockGetEventTypeStats() : api.get('/event-types/stats');

// POST /api/event-types — create new event type
export const createEventType = (payload) =>
  isGuest() ? mockCreateEventType(payload) : api.post('/event-types', payload);

// PATCH /api/event-types/:id/toggle — toggle active status
export const toggleEventType = (id) =>
  isGuest() ? mockToggleEventType(id) : api.patch(`/event-types/${id}/toggle`);
