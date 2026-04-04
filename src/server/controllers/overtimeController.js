import pool from '../utils/db.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

export const getOvertimeRequests = async (req, res) => {
  const empId    = req.user.employeeId;
  const page     = Math.max(1, parseInt(req.query.page, 10)     || 1);
  const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 10);
  const status   = req.query.status || '';
  const month    = req.query.month  || '';

  try {
    const conditions = ['ot.employee_id = $1'];
    const params     = [empId];
    let   idx        = 2;

    if (status) { conditions.push(`rs.name = $${idx++}`); params.push(status); }
    if (month)  { conditions.push(`TO_CHAR(ot.ot_date, 'YYYY-MM') = $${idx++}`); params.push(month); }

    const where = conditions.join(' AND ');

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM overtime_requests ot
       JOIN request_statuses rs ON rs.id = ot.status_id
       WHERE ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const offset = (page - 1) * pageSize;
    const { rows } = await pool.query(
      `SELECT
         ot.id, ot.reference_no,
         TO_CHAR(ot.ot_date, 'Mon DD, YYYY')    AS ot_date,
         TO_CHAR(ot.ot_date, 'Mon DD, YYYY')    AS date,
         TO_CHAR(ot.ot_start, 'HH12:MI AM')    AS ot_start,
         TO_CHAR(ot.ot_end,   'HH12:MI AM')    AS ot_end,
         ot.total_hours,
         ot.reason,
         TO_CHAR(ot.filed_on, 'Mon DD, YYYY')  AS filed_on,
         rs.name AS status,
         CASE WHEN rb.id IS NOT NULL
              THEN CONCAT(rb.first_name, ' ', rb.last_name)
              ELSE '—'
         END AS approved_by
       FROM overtime_requests ot
       JOIN request_statuses rs ON rs.id = ot.status_id
       LEFT JOIN employees   rb ON rb.id = ot.reviewed_by
       WHERE ${where}
       ORDER BY ot.filed_on DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, pageSize, offset]
    );

    sendPaginated(res, rows, total, page, pageSize);
  } catch (err) {
    console.error('[Overtime] getOvertimeRequests error:', err.message);
    sendError(res, 'Failed to fetch overtime requests', 500, err.message);
  }
};

export const getOvertimeStats = async (req, res) => {
  const empId = req.user.employeeId;
  try {
    const { rows } = await pool.query(
      `SELECT rs.name AS status, COUNT(*) AS count
       FROM overtime_requests ot
       JOIN request_statuses rs ON rs.id = ot.status_id
       WHERE ot.employee_id = $1
       GROUP BY rs.name`,
      [empId]
    );

    const stats = { total: 0, approved: 0, pending: 0, rejected: 0 };
    rows.forEach(({ status, count }) => {
      const n = parseInt(count, 10);
      stats.total += n;
      stats[status.toLowerCase()] = n;
    });

    sendSuccess(res, stats);
  } catch (err) {
    console.error('[Overtime] getOvertimeStats error:', err.message);
    sendError(res, 'Failed to fetch stats', 500, err.message);
  }
};

// Now accepts dateFrom + dateTo (multi-day OT support)
export const createOvertimeRequest = async (req, res) => {
  const empId = req.user.employeeId;
  const { dateFrom, dateTo, otStart, otEnd, reason } = req.body;

  if (!dateFrom || !dateTo || !otStart || !otEnd) {
    return sendError(res, 'Start date, end date, start time, and end time are required', 400);
  }
  if (otEnd <= otStart) {
    return sendError(res, 'OT end time must be after start time', 400);
  }
  if (dateTo < dateFrom) {
    return sendError(res, 'End date must be on or after start date', 400);
  }

  try {
    const year = new Date(dateFrom).getFullYear();
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM overtime_requests WHERE reference_no LIKE $1`,
      [`OT-${year}-%`]
    );
    const seq   = parseInt(countRes.rows[0].count, 10) + 1;
    const refNo = `OT-${year}-${String(seq).padStart(3, '0')}`;

    const statusRes = await pool.query(`SELECT id FROM request_statuses WHERE name = 'Pending'`);
    const statusId  = statusRes.rows[0].id;

    // Compute hours per day and multiply by number of days
    const [sh, sm] = otStart.split(':').map(Number);
    const [eh, em] = otEnd.split(':').map(Number);
    const hoursPerDay = ((eh * 60 + em) - (sh * 60 + sm)) / 60;
    const dayCount = Math.round((new Date(dateTo) - new Date(dateFrom)) / 86400000) + 1;
    const totalHours = +(hoursPerDay * dayCount).toFixed(2);

    // Store dateFrom as ot_date (primary date), dateTo in remarks if multi-day
    const remarks = dateTo !== dateFrom ? `Multi-day OT: ${dateFrom} to ${dateTo}` : null;

    const { rows } = await pool.query(
      `INSERT INTO overtime_requests
         (reference_no, employee_id, ot_date, ot_start, ot_end, total_hours, reason, status_id, remarks)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, reference_no,
                 TO_CHAR(ot_date, 'Mon DD, YYYY')  AS ot_date,
                 TO_CHAR(ot_start, 'HH12:MI AM')   AS ot_start,
                 TO_CHAR(ot_end,   'HH12:MI AM')   AS ot_end,
                 total_hours, reason,
                 TO_CHAR(filed_on, 'Mon DD, YYYY') AS filed_on`,
      [refNo, empId, dateFrom, otStart, otEnd, totalHours, reason || null, statusId, remarks]
    );

    sendSuccess(res, { ...rows[0], status: 'Pending', approvedBy: '—', dateTo }, 'Overtime request filed', 201);
  } catch (err) {
    console.error('[Overtime] createOvertimeRequest error:', err.message);
    sendError(res, 'Failed to file overtime request', 500, err.message);
  }
};

export const cancelOvertimeRequest = async (req, res) => {
  const empId = req.user.employeeId;
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT ot.id, rs.name AS status
       FROM overtime_requests ot
       JOIN request_statuses rs ON rs.id = ot.status_id
       WHERE ot.id = $1 AND ot.employee_id = $2`,
      [id, empId]
    );

    if (!rows.length) return sendError(res, 'Overtime request not found', 404);
    if (rows[0].status !== 'Pending') {
      return sendError(res, 'Only pending requests can be cancelled', 400);
    }

    const cancelRes = await pool.query(`SELECT id FROM request_statuses WHERE name = 'Cancelled'`);
    await pool.query(
      `UPDATE overtime_requests SET status_id = $1 WHERE id = $2`,
      [cancelRes.rows[0].id, id]
    );

    sendSuccess(res, null, 'Overtime request cancelled');
  } catch (err) {
    console.error('[Overtime] cancelOvertimeRequest error:', err.message);
    sendError(res, 'Failed to cancel request', 500, err.message);
  }
};
