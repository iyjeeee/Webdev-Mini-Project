import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getAttendanceLogs,
  getAttendanceStats,
  getTodayAttendance,
  timeIn,
  timeOut,
} from '../controllers/attendanceController.js';

const router = Router();
router.use(auth);

router.get('/',        getAttendanceLogs);    // GET  /api/attendance
router.get('/stats',   getAttendanceStats);   // GET  /api/attendance/stats
router.get('/today',   getTodayAttendance);   // GET  /api/attendance/today
router.post('/time-in',  timeIn);             // POST /api/attendance/time-in
router.post('/time-out', timeOut);            // POST /api/attendance/time-out

export default router;
