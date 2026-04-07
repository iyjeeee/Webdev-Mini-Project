// calendarApi.js — Calendar event API calls
// Routes to mockApiService when guest mode is active (token === 'guest').

import api from './apiClient.js';
import {
  mockGetCalendarEvents,
  mockGetUpcomingEvents,
  mockCreateCalendarEvent,
} from '../data/mockApiService.js';

const isGuest = () => localStorage.getItem('token') === 'guest';

// GET /api/calendar — all events (optional month/typeId filter)
export const getCalendarEvents = (params = {}) =>
  isGuest() ? mockGetCalendarEvents(params) : api.get('/calendar', params);

// GET /api/calendar/upcoming — next 5 upcoming events for dashboard
export const getUpcomingEvents = () =>
  isGuest() ? mockGetUpcomingEvents() : api.get('/calendar/upcoming');

// POST /api/calendar — create new calendar event
export const createCalendarEvent = (payload) =>
  isGuest() ? mockCreateCalendarEvent(payload) : api.post('/calendar', payload);
