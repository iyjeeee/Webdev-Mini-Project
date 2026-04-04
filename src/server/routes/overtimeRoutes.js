import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getOvertimeRequests,
  getOvertimeStats,
  createOvertimeRequest,
  cancelOvertimeRequest,
} from '../controllers/overtimeController.js';

const router = Router();
router.use(auth); // all routes require valid JWT

router.get('/',              getOvertimeRequests);   // GET  /api/overtime
router.get('/stats',         getOvertimeStats);      // GET  /api/overtime/stats
router.post('/',             createOvertimeRequest); // POST /api/overtime
router.patch('/:id/cancel',  cancelOvertimeRequest); // PATCH /api/overtime/:id/cancel

export default router;
