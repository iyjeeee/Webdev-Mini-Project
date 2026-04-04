import api from './apiClient.js';

// GET /api/event-types — paginated list
export const getEventTypes = (params = {}) =>
  api.get('/event-types', params);

// GET /api/event-types/stats — stat card counts
export const getEventTypeStats = () =>
  api.get('/event-types/stats');

// POST /api/event-types — create new event type
export const createEventType = (payload) =>
  api.post('/event-types', payload);

// PATCH /api/event-types/:id/toggle — toggle active status
export const toggleEventType = (id) =>
  api.patch(`/event-types/${id}/toggle`);
