import pool from '../utils/db.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

// ── GET /api/leave ────────────────────────────────────────────
export const getLeaveRequests = async (req, res) => {
  const empId    = req.user.employeeId;
  const page     = Math.max(1, parseInt(req.query.page, 10)     || 1);
  const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 10);
  const status   = req.query.status || '';
  const year     = req.query.year   || '';

  try {
    const conditions = ['lr.employee_id = $1'];
    const params     = [empId];
    let   idx        = 2;

    if (status && status !== 'All Status') {
      conditions.push(`rs.name = $${idx++}`);
      params.push(status);
    }
    if (year && year !== 'All') {
      conditions.push(`EXTRACT(YEAR FROM lr.filed_on) = $${idx++}`);
      params.push(parseInt(year, 10));
    }

    const where = conditions.join(' AND ');

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM leave_requests lr
       JOIN request_statuses rs ON rs.id = lr.status_id
       WHERE ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const offset = (page - 1) * pageSize;
    const { rows } = await pool.query(
      `SELECT
         lr.id, lr.reference_no,
         lt.name AS leave_type,
         TO_CHAR(lr.date_from, 'Mon DD, YYYY') AS date_from,
         TO_CHAR(lr.date_to,   'Mon DD, YYYY') AS date_to,
         lr.number_of_days,
         lr.reason,
         TO_CHAR(lr.filed_on, 'Mon DD, YYYY')  AS filed_on,
         rs.name AS status
       FROM leave_requests lr
       JOIN request_statuses rs ON rs.id = lr.status_id
       JOIN leave_types      lt ON lt.id = lr.leave_type_id
       WHERE ${where}
       ORDER BY lr.filed_on DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, pageSize, offset]
    );

    sendPaginated(res, rows, total, page, pageSize);
  } catch (err) {
    console.error('[Leave] getLeaveRequests error:', err.message);
    sendError(res, 'Failed to fetch leave requests', 500, err.message);
  }
};

// ── GET /api/leave/credits ────────────────────────────────────
// Fixed: uses leave_credits (actual table), not leave_credit_allocations
export const getLeaveCredits = async (req, res) => {
  const empId = req.user.employeeId;

  try {
    const { rows } = await pool.query(
      `SELECT lt.name AS leave_type, lt.code,
              lc.total_days, lc.used_days,
              (lc.total_days - lc.used_days) AS remaining_days
       FROM leave_credits lc
       JOIN leave_types lt ON lt.id = lc.leave_type_id
       WHERE lc.employee_id = $1
       ORDER BY lt.id`,
      [empId]
    );

    sendSuccess(res, rows);
  } catch (err) {
    console.error('[Leave] getLeaveCredits error:', err.message);
    sendError(res, 'Failed to fetch leave credits', 500, err.message);
  }
};

// ── GET /api/leave/stats ──────────────────────────────────────
// Fixed: uses leave_credits, not leave_credit_allocations
export const getLeaveStats = async (req, res) => {
  const empId = req.user.employeeId;

  try {
    const [statusRes, usedRes] = await Promise.all([
      pool.query(
        `SELECT rs.name AS status, COUNT(*) AS count
         FROM leave_requests lr
         JOIN request_statuses rs ON rs.id = lr.status_id
         WHERE lr.employee_id = $1
         GROUP BY rs.name`,
        [empId]
      ),
      pool.query(
        `SELECT COALESCE(SUM(used_days), 0) AS used_this_year
         FROM leave_credits
         WHERE employee_id = $1`,
        [empId]
      ),
    ]);

    const stats = { total: 0, approved: 0, pending: 0, rejected: 0, cancelled: 0 };
    statusRes.rows.forEach(({ status, count }) => {
      const n = parseInt(count, 10);
      stats.total += n;
      stats[status.toLowerCase()] = n;
    });
    stats.usedThisYear = parseInt(usedRes.rows[0].used_this_year, 10);

    sendSuccess(res, stats);
  } catch (err) {
    console.error('[Leave] getLeaveStats error:', err.message);
    sendError(res, 'Failed to fetch stats', 500, err.message);
  }
};

// ── POST /api/leave ───────────────────────────────────────────
// Fixed: uses leave_credits, not leave_credit_allocations
export const createLeaveRequest = async (req, res) => {
  const empId = req.user.employeeId;
  const { leaveTypeCode, dateFrom, dateTo, reason } = req.body;

  if (!leaveTypeCode || !dateFrom || !dateTo || !reason?.trim()) {
    return sendError(res, 'Leave type, date range, and reason are required', 400);
  }

  try {
    await pool.query('BEGIN');

    const ltRes = await pool.query(
      `SELECT id, name FROM leave_types WHERE code = $1 AND is_active = TRUE`,
      [leaveTypeCode]
    );
    if (!ltRes.rows.length) {
      await pool.query('ROLLBACK');
      return sendError(res, 'Invalid leave type', 400);
    }
    const { id: leaveTypeId } = ltRes.rows[0];

    const from = new Date(dateFrom);
    const to   = new Date(dateTo);
    if (to < from) {
      await pool.query('ROLLBACK');
      return sendError(res, 'Date To must be on or after Date From', 400);
    }
    const numDays = Math.round((to - from) / 86400000) + 1;

    // Check available credits from leave_credits table
    const lcRes = await pool.query(
      `SELECT id, total_days, used_days
       FROM leave_credits
       WHERE employee_id = $1 AND leave_type_id = $2`,
      [empId, leaveTypeId]
    );

    if (!lcRes.rows.length) {
      await pool.query('ROLLBACK');
      return sendError(res, 'No leave credits found for this leave type', 400);
    }
    const lc = lcRes.rows[0];
    const remaining = lc.total_days - lc.used_days;
    if (numDays > remaining) {
      await pool.query('ROLLBACK');
      return sendError(res, `Insufficient leave credits. Available: ${remaining} day(s)`, 400);
    }

    // Generate reference number
    const year = from.getFullYear();
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM leave_requests WHERE reference_no LIKE $1`, [`LV-${year}-%`]
    );
    const seq   = parseInt(countRes.rows[0].count, 10) + 1;
    const refNo = `LV-${year}-${String(seq).padStart(3, '0')}`;

    const statusRes = await pool.query(`SELECT id FROM request_statuses WHERE name = 'Pending'`);
    const statusId  = statusRes.rows[0].id;

    const { rows } = await pool.query(
      `INSERT INTO leave_requests
         (reference_no, employee_id, leave_type_id, date_from, date_to, number_of_days, reason, status_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, reference_no,
                 TO_CHAR(date_from, 'Mon DD, YYYY') AS date_from,
                 TO_CHAR(date_to,   'Mon DD, YYYY') AS date_to,
                 number_of_days, reason,
                 TO_CHAR(filed_on, 'Mon DD, YYYY')  AS filed_on`,
      [refNo, empId, leaveTypeId, dateFrom, dateTo, numDays, reason, statusId]
    );

    // Deduct from leave_credits
    await pool.query(
      `UPDATE leave_credits
       SET used_days = used_days + $1, updated_at = NOW()
       WHERE id = $2`,
      [numDays, lc.id]
    );

    await pool.query('COMMIT');

    sendSuccess(res, {
      ...rows[0],
      leaveType: ltRes.rows[0].name,
      status:    'Pending',
    }, 'Leave request filed', 201);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('[Leave] createLeaveRequest error:', err.message);
    sendError(res, 'Failed to file leave request', 500, err.message);
  }
};

// ── PATCH /api/leave/:id/cancel ───────────────────────────────
// Fixed: uses leave_credits, not leave_credit_allocations
export const cancelLeaveRequest = async (req, res) => {
  const empId = req.user.employeeId;
  const { id } = req.params;

  try {
    await pool.query('BEGIN');

    const { rows } = await pool.query(
      `SELECT lr.id, lr.leave_type_id, lr.number_of_days, rs.name AS status
       FROM leave_requests lr
       JOIN request_statuses rs ON rs.id = lr.status_id
       WHERE lr.id = $1 AND lr.employee_id = $2`,
      [id, empId]
    );

    if (!rows.length) { await pool.query('ROLLBACK'); return sendError(res, 'Leave request not found', 404); }
    if (rows[0].status !== 'Pending') {
      await pool.query('ROLLBACK');
      return sendError(res, 'Only pending requests can be cancelled', 400);
    }

    const { leave_type_id, number_of_days } = rows[0];

    const cancelRes = await pool.query(`SELECT id FROM request_statuses WHERE name = 'Cancelled'`);
    await pool.query(
      `UPDATE leave_requests SET status_id = $1 WHERE id = $2`,
      [cancelRes.rows[0].id, id]
    );

    // Restore credits in leave_credits
    await pool.query(
      `UPDATE leave_credits
       SET used_days = GREATEST(0, used_days - $1), updated_at = NOW()
       WHERE employee_id = $2 AND leave_type_id = $3`,
      [number_of_days, empId, leave_type_id]
    );

    await pool.query('COMMIT');
    sendSuccess(res, null, 'Leave request cancelled');
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('[Leave] cancelLeaveRequest error:', err.message);
    sendError(res, 'Failed to cancel leave request', 500, err.message);
  }
};
