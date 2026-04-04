import pool from '../utils/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── GET /api/employee/profile ─────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM employee_profile_view WHERE id = $1',
      [req.user.employeeId]
    );
    if (!rows.length) return sendError(res, 'Employee not found', 404);
    sendSuccess(res, rows[0]);
  } catch (err) {
    console.error('[Employee] getProfile error:', err.message);
    sendError(res, 'Failed to fetch profile', 500, err.message);
  }
};

// ── PATCH /api/employee/profile ───────────────────────────────
// Allows employees to update their own personal / contact details
export const updateProfile = async (req, res) => {
  const empId = req.user.employeeId;

  // Only allow editable fields — never allow role/dept/salary changes via this endpoint
  const ALLOWED = [
    'contact_number',
    'residence_address',
    'personal_email',
    'civil_status',
    'profile_photo_url',
  ];

  const updates = {};
  for (const key of ALLOWED) {
    if (key in req.body) {
      updates[key] = req.body[key] ?? null;
    }
  }

  if (Object.keys(updates).length === 0) {
    return sendError(res, 'No valid fields to update', 400);
  }

  try {
    // Build dynamic SET clause
    const setClauses = Object.keys(updates).map((col, i) => `${col} = $${i + 1}`);
    const values     = [...Object.values(updates), empId];

    await pool.query(
      `UPDATE employees SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${values.length}`,
      values
    );

    // Return fresh profile
    const { rows } = await pool.query(
      'SELECT * FROM employee_profile_view WHERE id = $1',
      [empId]
    );

    sendSuccess(res, rows[0], 'Profile updated successfully');
  } catch (err) {
    console.error('[Employee] updateProfile error:', err.message);
    sendError(res, 'Failed to update profile', 500, err.message);
  }
};

// ── GET /api/employee/directory — all active employees ───────
export const getDirectory = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         e.id,
         e.employee_no,
         concat(e.first_name, ' ', COALESCE(e.middle_name || ' ', ''), e.last_name) AS full_name,
         e.first_name,
         e.last_name,
         jp.title  AS job_position,
         d.name    AS department,
         e.work_arrangement,
         e.date_hired,
         e.is_active,
         e.contact_number,
         u.email   AS company_email
       FROM employees e
       LEFT JOIN job_positions jp ON jp.id = e.job_position_id
       LEFT JOIN departments   d  ON d.id  = e.department_id
       LEFT JOIN users         u  ON u.employee_id = e.id
       ORDER BY d.name, e.last_name, e.first_name`
    );
    sendSuccess(res, rows);
  } catch (err) {
    console.error('[Employee] getDirectory error:', err.message);
    sendError(res, 'Failed to fetch directory', 500, err.message);
  }
};

// ── GET /api/employee/dashboard ──────────────────────────────
export const getDashboard = async (req, res) => {
  const empId = req.user.employeeId;
  const month = new Date().toISOString().slice(0, 7);

  try {
    const [
      profileResult,
      attendanceResult,
      leaveCreditsResult,
      otSummaryResult,
      pendingTasksResult,
      presentResult,
    ] = await Promise.all([
      pool.query('SELECT * FROM employee_profile_view WHERE id = $1', [empId]),

      pool.query(
        `SELECT time_in, time_out, hours_rendered, status, is_late, late_minutes, remarks
         FROM attendance_logs WHERE employee_id = $1 AND log_date = CURRENT_DATE`,
        [empId]
      ),

      pool.query(
        `SELECT lt.name AS leave_type, lc.total_days, lc.used_days,
                (lc.total_days - lc.used_days) AS remaining_days
         FROM leave_credits lc
         JOIN leave_types lt ON lt.id = lc.leave_type_id
         WHERE lc.employee_id = $1`,
        [empId]
      ),

      pool.query(
        `SELECT
           COUNT(*) FILTER (WHERE rs.name = 'Pending')  AS pending,
           COUNT(*) FILTER (WHERE rs.name = 'Approved') AS approved,
           COUNT(*) FILTER (WHERE rs.name = 'Rejected') AS rejected,
           COALESCE(SUM(ot.total_hours) FILTER (WHERE rs.name = 'Approved'), 0) AS approved_hours,
           COALESCE(SUM(ot.total_hours), 0) AS total_hours
         FROM overtime_requests ot
         JOIN request_statuses rs ON rs.id = ot.status_id
         WHERE ot.employee_id = $1 AND TO_CHAR(ot.ot_date, 'YYYY-MM') = $2`,
        [empId, month]
      ),

      pool.query(
        `SELECT COUNT(*) FROM tasks WHERE employee_id = $1 AND status IN ('To Do', 'In Progress')`,
        [empId]
      ),

      pool.query(
        `SELECT COUNT(*) FROM attendance_logs
         WHERE employee_id = $1 AND status = 'Present'
           AND TO_CHAR(log_date, 'YYYY-MM') = $2`,
        [empId, month]
      ),
    ]);

    if (!profileResult.rows.length) return sendError(res, 'Employee not found', 404);

    const otRow = otSummaryResult.rows[0] || {};

    sendSuccess(res, {
      profile:          profileResult.rows[0],
      todayAttendance:  attendanceResult.rows[0] || null,
      leaveSummary:     leaveCreditsResult.rows,
      otSummary: {
        pending:        parseInt(otRow.pending,        10) || 0,
        approved:       parseInt(otRow.approved,       10) || 0,
        rejected:       parseInt(otRow.rejected,       10) || 0,
        approved_hours: parseFloat(otRow.approved_hours)   || 0,
        total_hours:    parseFloat(otRow.total_hours)      || 0,
      },
      pendingOt:        parseInt(otRow.pending,         10) || 0,
      pendingTasks:     parseInt(pendingTasksResult.rows[0]?.count, 10) || 0,
      presentThisMonth: parseInt(presentResult.rows[0]?.count,     10) || 0,
    });
  } catch (err) {
    console.error('[Employee] getDashboard error:', err.message);
    sendError(res, 'Failed to fetch dashboard data', 500, err.message);
  }
};
