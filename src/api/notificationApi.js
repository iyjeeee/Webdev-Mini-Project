import api from './apiClient.js';

// GET /api/notifications — paginated list
export const getNotifications = (params = {}) =>
  api.get('/notifications', params);

// GET /api/notifications/unread-count — badge count
export const getUnreadCount = () =>
  api.get('/notifications/unread-count');

// PATCH /api/notifications/:id/read — mark one as read
export const markAsRead = (id) =>
  api.patch(`/notifications/${id}/read`);

// PATCH /api/notifications/mark-all-read — mark all read
export const markAllAsRead = () =>
  api.patch('/notifications/mark-all-read');
