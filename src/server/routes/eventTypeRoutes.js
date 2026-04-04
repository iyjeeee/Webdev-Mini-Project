import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getEventTypes,
  getEventTypeStats,
  createEventType,
  toggleEventType,
} from '../controllers/eventTypeController.js';

const router = Router();
router.use(auth);

router.get('/',               getEventTypes);      // GET  /api/event-types
router.get('/stats',          getEventTypeStats);  // GET  /api/event-types/stats
router.post('/',              createEventType);    // POST /api/event-types
router.patch('/:id/toggle',   toggleEventType);   // PATCH /api/event-types/:id/toggle

export default router;
