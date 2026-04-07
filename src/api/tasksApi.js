// tasksApi.js — Tasks API calls
// Routes to mockApiService when guest mode is active (token === 'guest').

import api from './apiClient.js';
import {
  mockGetTasks,
  mockCreateTask,
  mockUpdateTask,
  mockDeleteTask,
} from '../data/mockApiService.js';

const isGuest = () => localStorage.getItem('token') === 'guest';

// GET /api/tasks — paginated list with optional filters
export const getTasks = (params = {}) =>
  isGuest() ? mockGetTasks(params) : api.get('/tasks', params);

// POST /api/tasks — create new task
export const createTask = (payload) =>
  isGuest() ? mockCreateTask(payload) : api.post('/tasks', payload);

// PATCH /api/tasks/:id — update task fields
export const updateTask = (id, payload) =>
  isGuest() ? mockUpdateTask(id, payload) : api.patch(`/tasks/${id}`, payload);

// DELETE /api/tasks/:id — remove task
export const deleteTask = (id) =>
  isGuest() ? mockDeleteTask(id) : api.delete(`/tasks/${id}`);
