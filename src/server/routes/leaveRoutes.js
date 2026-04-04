import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getLeaveRequests,
  getLeaveCredits,
  getLeaveStats,
  createLeaveRequest,
  cancelLeaveRequest,
} from '../controllers/leaveController.js';

const router = Router();
router.use(auth);

router.get('/',             getLeaveRequests);    // GET  /api/leave
router.get('/credits',      getLeaveCredits);     // GET  /api/leave/credits
router.get('/stats',        getLeaveStats);       // GET  /api/leave/stats
router.post('/',            createLeaveRequest);  // POST /api/leave
router.patch('/:id/cancel', cancelLeaveRequest);  // PATCH /api/leave/:id/cancel

export default router;
