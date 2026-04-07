// notificationApi.js — Notification API calls
// Routes to mockApiService when guest mode is active (token === 'guest').

import api from './apiClient.js';
import {
  mockGetNotifications,
  mockGetUnreadCount,
  mockMarkAsRead,
  mockMarkAllAsRead,
} from '../data/mockApiService.js';

const isGuest = () => localStorage.getItem('token') === 'guest';

// GET /api/notifications — paginated list
export const getNotifications = (params = {}) =>
  isGuest() ? mockGetNotifications(params) : api.get('/notifications', params);

// GET /api/notifications/unread-count — badge count
export const getUnreadCount = () =>
  isGuest() ? mockGetUnreadCount() : api.get('/notifications/unread-count');

// PATCH /api/notifications/:id/read — mark one as read
export const markAsRead = (id) =>
  isGuest() ? mockMarkAsRead(id) : api.patch(`/notifications/${id}/read`);

// PATCH /api/notifications/mark-all-read — mark all read
export const markAllAsRead = () =>
  isGuest() ? mockMarkAllAsRead() : api.patch('/notifications/mark-all-read');
