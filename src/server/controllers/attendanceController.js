import pool from '../utils/db.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

export const getAttendanceLogs = async (req, res) => {
  const empId    = req.user.employeeId;
  const page     = Math.max(1, parseInt(req.query.page, 10)     || 1);
  const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 10);
  const month    = req.query.month || '';

  try {
    const conditions = ['al.employee_id = $1'];
    const params     = [empId];
    let   idx        = 2;

    if (month) {
      conditions.push(`TO_CHAR(al.log_date, 'YYYY-MM') = $${idx++}`);
      params.push(month);
    }

    const where = conditions.join(' AND ');

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM attendance_logs al WHERE ${where}`, params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const offset = (page - 1) * pageSize;
    const { rows } = await pool.query(
      `SELECT
         al.id,
         TO_CHAR(al.log_date, 'Month DD, YYYY') AS date,
         TRIM(TO_CHAR(al.log_date, 'Day'))       AS day,
         al.status,
         TO_CHAR(al.time_in  AT TIME ZONE 'Asia/Manila', 'HH12:MI AM') AS time_in,
         TO_CHAR(al.time_out AT TIME ZONE 'Asia/Manila', 'HH12:MI AM') AS time_out,
         al.hours_rendered,
         al.is_late,
         al.late_minutes,
         al.remarks,
         al.log_date
       FROM attendance_logs al
       WHERE ${where}
       ORDER BY al.log_date DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, pageSize, offset]
    );

    sendPaginated(res, rows, total, page, pageSize);
  } catch (err) {
    console.error('[Attendance] getAttendanceLogs error:', err.message);
    sendError(res, 'Failed to fetch attendance logs', 500, err.message);
  }
};

export const getAttendanceStats = async (req, res) => {
  const empId = req.user.employeeId;
  const month = req.query.month || new Date().toISOString().slice(0, 7);

  try {
    const { rows } = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'Present')  AS present,
         COUNT(*) FILTER (WHERE status = 'Absent')   AS absent,
         COUNT(*) FILTER (WHERE status = 'On Leave') AS on_leave,
         COUNT(*) FILTER (WHERE is_late = TRUE)       AS late
       FROM attendance_logs
       WHERE employee_id = $1 AND TO_CHAR(log_date, 'YYYY-MM') = $2`,
      [empId, month]
    );
    sendSuccess(res, rows[0]);
  } catch (err) {
    console.error('[Attendance] getAttendanceStats error:', err.message);
    sendError(res, 'Failed to fetch attendance stats', 500, err.message);
  }
};

export const getTodayAttendance = async (req, res) => {
  const empId = req.user.employeeId;
  try {
    const { rows } = await pool.query(
      `SELECT
         al.id, al.status,
         TO_CHAR(al.time_in  AT TIME ZONE 'Asia/Manila', 'HH12:MI AM') AS time_in,
         TO_CHAR(al.time_out AT TIME ZONE 'Asia/Manila', 'HH12:MI AM') AS time_out,
         al.hours_rendered, al.is_late, al.late_minutes, al.remarks
       FROM attendance_logs al
       WHERE al.employee_id = $1 AND al.log_date = CURRENT_DATE`,
      [empId]
    );
    sendSuccess(res, rows[0] || null);
  } catch (err) {
    console.error('[Attendance] getTodayAttendance error:', err.message);
    sendError(res, "Failed to fetch today's attendance", 500, err.message);
  }
};

// Late threshold: 9:00 AM Manila time
const LATE_HOUR = 9;
const LATE_MIN  = 0;

export const timeIn = async (req, res) => {
  const empId = req.user.employeeId;
  try {
    const existing = await pool.query(
      `SELECT id, time_in FROM attendance_logs WHERE employee_id = $1 AND log_date = CURRENT_DATE`,
      [empId]
    );
    if (existing.rows.length && existing.rows[0].time_in) {
      return sendError(res, 'Already timed in for today', 400);
    }

    const nowPH   = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    const reqMs   = (LATE_HOUR * 60 + LATE_MIN) * 60000;
    const nowMs   = (nowPH.getHours() * 60 + nowPH.getMinutes()) * 60000;
    const isLate  = nowMs > reqMs;
    const lateMins = isLate ? Math.round((nowMs - reqMs) / 60000) : 0;
    // Status: 'L' for late, 'Present' otherwise
    const status  = isLate ? 'L' : 'Present';

    let newRow;
    if (existing.rows.length) {
      const upd = await pool.query(
        `UPDATE attendance_logs
         SET time_in = NOW(), status = $2, is_late = $3, late_minutes = $4
         WHERE id = $1
         RETURNING id, TO_CHAR(time_in AT TIME ZONE 'Asia/Manila', 'HH12:MI AM') AS time_in, status`,
        [existing.rows[0].id, status, isLate, lateMins]
      );
      newRow = upd.rows[0];
    } else {
      const ins = await pool.query(
        `INSERT INTO attendance_logs (employee_id, log_date, time_in, status, is_late, late_minutes)
         VALUES ($1, CURRENT_DATE, NOW(), $2, $3, $4)
         RETURNING id, TO_CHAR(time_in AT TIME ZONE 'Asia/Manila', 'HH12:MI AM') AS time_in, status`,
        [empId, status, isLate, lateMins]
      );
      newRow = ins.rows[0];
    }

    sendSuccess(res, { ...newRow, isLate, lateMins }, 'Time-in recorded', 201);
  } catch (err) {
    console.error('[Attendance] timeIn error:', err.message);
    sendError(res, 'Failed to record time-in', 500, err.message);
  }
};

export const timeOut = async (req, res) => {
  const empId = req.user.employeeId;
  try {
    const existing = await pool.query(
      `SELECT id, time_in, time_out FROM attendance_logs WHERE employee_id = $1 AND log_date = CURRENT_DATE`,
      [empId]
    );
    if (!existing.rows.length || !existing.rows[0].time_in) {
      return sendError(res, 'No time-in found for today', 400);
    }
    if (existing.rows[0].time_out) {
      return sendError(res, 'Already timed out for today', 400);
    }

    const { rows } = await pool.query(
      `UPDATE attendance_logs
       SET time_out = NOW(),
           hours_rendered = ROUND(EXTRACT(EPOCH FROM (NOW() - time_in)) / 3600.0, 2)
       WHERE id = $1
       RETURNING id,
         TO_CHAR(time_out AT TIME ZONE 'Asia/Manila', 'HH12:MI AM') AS time_out,
         hours_rendered`,
      [existing.rows[0].id]
    );

    sendSuccess(res, rows[0], 'Time-out recorded');
  } catch (err) {
    console.error('[Attendance] timeOut error:', err.message);
    sendError(res, 'Failed to record time-out', 500, err.message);
  }
};
