import api from './apiClient.js';

// GET /api/calendar — all events (optional month/typeId filter)
export const getCalendarEvents = (params = {}) =>
  api.get('/calendar', params);

// GET /api/calendar/upcoming — next 5 upcoming events for dashboard
export const getUpcomingEvents = () =>
  api.get('/calendar/upcoming');

// POST /api/calendar — create new calendar event
export const createCalendarEvent = (payload) =>
  api.post('/calendar', payload);
