import express    from 'express';
import cors       from 'cors';
import dotenv     from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Resolve .env from project root (two levels up from src/server/)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath   = resolve(__dirname, '../../.env');
const envResult = dotenv.config({ path: envPath }); // loads root .env

// Startup confirmation — helps diagnose missing .env issues
if (envResult.error) {
  console.warn('[Server] WARNING: .env not found at', envPath, '— using system environment variables');
} else {
  console.log('[Server] .env loaded from', envPath);
}
// Confirm DB password is a string (SASL auth requires this — never undefined)
if (typeof process.env.DB_PASSWORD === 'undefined') {
  console.warn('[Server] WARNING: DB_PASSWORD is not set in .env — using empty string for DB auth');
}

// Route imports — all relative to src/server/
import authRoutes         from './routes/authRoutes.js';
import employeeRoutes     from './routes/employeeRoutes.js';
import overtimeRoutes     from './routes/overtimeRoutes.js';
import leaveRoutes        from './routes/leaveRoutes.js';
import eventTypeRoutes    from './routes/eventTypeRoutes.js';
import attendanceRoutes   from './routes/attendanceRoutes.js';
import calendarRoutes     from './routes/calendarRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import tasksRoutes        from './routes/tasksRoutes.js'; // task board routes — was missing

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
  credentials: true,
}));
app.use(express.json());                          // parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // parse URL-encoded bodies

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/employee',      employeeRoutes);
app.use('/api/overtime',      overtimeRoutes);
app.use('/api/leave',         leaveRoutes);
app.use('/api/event-types',   eventTypeRoutes);
app.use('/api/attendance',    attendanceRoutes);
app.use('/api/calendar',      calendarRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tasks',         tasksRoutes); // task board — was missing from original

// ── 404 — unknown routes ──────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Server] Unhandled error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Server] API running on http://localhost:${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});
