import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getProfile, updateProfile, getDashboard, getDirectory } from '../controllers/employeeController.js';

const router = Router();

router.use(auth); // all routes below require valid JWT

router.get('/profile',   getProfile);    // GET  /api/employee/profile
router.patch('/profile', updateProfile); // PATCH /api/employee/profile
router.get('/dashboard', getDashboard);  // GET  /api/employee/dashboard
router.get('/directory', getDirectory);  // GET  /api/employee/directory

export default router;
