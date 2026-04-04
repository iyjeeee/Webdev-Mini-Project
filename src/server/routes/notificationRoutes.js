import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';

const router = Router();
router.use(auth);

router.get('/',                    getNotifications); // GET  /api/notifications
router.get('/unread-count',        getUnreadCount);   // GET  /api/notifications/unread-count
router.patch('/:id/read',          markAsRead);       // PATCH /api/notifications/:id/read
router.patch('/mark-all-read',     markAllAsRead);    // PATCH /api/notifications/mark-all-read

export default router;
