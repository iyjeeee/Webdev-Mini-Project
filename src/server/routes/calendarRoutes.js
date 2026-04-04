import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getCalendarEvents,
  getUpcomingEvents,
  createCalendarEvent,
} from '../controllers/calendarController.js';

const router = Router();
router.use(auth); // all calendar routes require valid JWT

router.get('/',          getCalendarEvents);   // GET  /api/calendar
router.get('/upcoming',  getUpcomingEvents);   // GET  /api/calendar/upcoming
router.post('/',         createCalendarEvent); // POST /api/calendar — add event

export default router;
