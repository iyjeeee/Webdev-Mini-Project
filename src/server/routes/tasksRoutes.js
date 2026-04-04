import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/tasksController.js';

const router = Router();
router.use(auth); // protect all task routes

router.get('/',     getTasks);           // GET  /api/tasks
router.post('/',    createTask);         // POST /api/tasks
router.patch('/:id', updateTask);        // PATCH /api/tasks/:id
router.delete('/:id', deleteTask);       // DELETE /api/tasks/:id

export default router;
