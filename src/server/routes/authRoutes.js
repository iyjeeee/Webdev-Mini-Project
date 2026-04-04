import { Router } from 'express';
import { login, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = Router();

router.post('/login',          login);          // POST /api/auth/login
router.post('/forgot-password', forgotPassword); // POST /api/auth/forgot-password
router.post('/reset-password',  resetPassword);  // POST /api/auth/reset-password

export default router;
