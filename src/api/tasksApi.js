import api from './apiClient.js';

// GET /api/tasks — paginated list with optional filters
export const getTasks = (params = {}) =>
  api.get('/tasks', params);

// POST /api/tasks — create new task
// payload: { title, description, project_name, priority, status, due_date }
export const createTask = (payload) =>
  api.post('/tasks', payload);

// PATCH /api/tasks/:id — update task fields (status, priority, etc.)
export const updateTask = (id, payload) =>
  api.patch(`/tasks/${id}`, payload);

// DELETE /api/tasks/:id — soft-delete or hard-delete task
export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);
