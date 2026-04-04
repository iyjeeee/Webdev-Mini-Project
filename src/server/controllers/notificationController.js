import pool from '../utils/db.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

// ── GET /api/notifications ────────────────────────────────────
// Returns paginated notifications for the logged-in employee
export const getNotifications = async (req, res) => {
  const empId    = req.user.employeeId;
  const page     = Math.max(1, parseInt(req.query.page, 10)     || 1);
  const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 10);

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE employee_id = $1`, [empId]
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const offset = (page - 1) * pageSize;
    const { rows } = await pool.query(
      `SELECT id, title, body, type, is_read,
              TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at
       FROM notifications
       WHERE employee_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [empId, pageSize, offset]
    );

    // Also return unread count for badge
    const unreadRes = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE employee_id = $1 AND is_read = FALSE`, [empId]
    );

    sendPaginated(res, rows, total, page, pageSize);
  } catch (err) {
    console.error('[Notification] getNotifications error:', err.message);
    sendError(res, 'Failed to fetch notifications', 500, err.message);
  }
};

// ── GET /api/notifications/unread-count ───────────────────────
export const getUnreadCount = async (req, res) => {
  const empId = req.user.employeeId;
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE employee_id = $1 AND is_read = FALSE`, [empId]
    );
    sendSuccess(res, { count: parseInt(rows[0].count, 10) });
  } catch (err) {
    console.error('[Notification] getUnreadCount error:', err.message);
    sendError(res, 'Failed to fetch unread count', 500, err.message);
  }
};

// ── PATCH /api/notifications/:id/read ────────────────────────
// Marks a single notification as read
export const markAsRead = async (req, res) => {
  const empId = req.user.employeeId;
  const { id } = req.params;
  try {
    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND employee_id = $2`,
      [id, empId]
    );
    sendSuccess(res, null, 'Notification marked as read');
  } catch (err) {
    console.error('[Notification] markAsRead error:', err.message);
    sendError(res, 'Failed to mark notification as read', 500, err.message);
  }
};

// ── PATCH /api/notifications/mark-all-read ────────────────────
// Marks all notifications as read for the employee
export const markAllAsRead = async (req, res) => {
  const empId = req.user.employeeId;
  try {
    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE employee_id = $1 AND is_read = FALSE`,
      [empId]
    );
    sendSuccess(res, null, 'All notifications marked as read');
  } catch (err) {
    console.error('[Notification] markAllAsRead error:', err.message);
    sendError(res, 'Failed to mark all as read', 500, err.message);
  }
};
