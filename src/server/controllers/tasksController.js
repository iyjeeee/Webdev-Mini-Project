import pool from '../utils/db.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

// ── GET /api/tasks — paginated task list for logged-in employee ──
export const getTasks = async (req, res) => {
  const empId    = req.user.employeeId;
  const page     = Math.max(1, parseInt(req.query.page,     10) || 1);
  const pageSize = Math.min(100, parseInt(req.query.pageSize, 10) || 100); // return all by default for Kanban
  const status   = req.query.status || '';   // optional filter by status
  const priority = req.query.priority || ''; // optional filter by priority

  try {
    const conditions = ['employee_id = $1'];
    const params     = [empId];
    let   idx        = 2;

    if (status)   { conditions.push(`status = $${idx++}`);   params.push(status);   }
    if (priority) { conditions.push(`priority = $${idx++}`); params.push(priority); }

    const where = conditions.join(' AND ');

    // Count for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM tasks WHERE ${where}`, params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const offset = (page - 1) * pageSize;
    const { rows } = await pool.query(
      `SELECT id, title, description, project_name, priority, status,
              due_date, created_at, updated_at
       FROM tasks
       WHERE ${where}
       ORDER BY
         CASE status
           WHEN 'In Progress' THEN 1
           WHEN 'To Do'       THEN 2
           WHEN 'Overdue'     THEN 3
           WHEN 'Completed'   THEN 4
           ELSE 5
         END,
         CASE priority
           WHEN 'High'   THEN 1
           WHEN 'Medium' THEN 2
           WHEN 'Low'    THEN 3
           ELSE 4
         END,
         created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, pageSize, offset]
    );

    sendPaginated(res, rows, total, page, pageSize);
  } catch (err) {
    console.error('[Tasks] getTasks error:', err.message);
    sendError(res, 'Failed to fetch tasks', 500, err.message);
  }
};

// ── POST /api/tasks — create a new task ──────────────────────
export const createTask = async (req, res) => {
  const empId = req.user.employeeId;
  const { title, description, project_name, priority, status, due_date } = req.body;

  if (!title || !title.trim()) {
    return sendError(res, 'Task title is required', 400);
  }

  // Validate VARCHAR enum values matching schema v2
  const validPriorities = ['High', 'Medium', 'Low'];
  const validStatuses   = ['To Do', 'In Progress', 'Completed', 'Overdue'];

  const finalPriority = validPriorities.includes(priority) ? priority : 'Medium';
  const finalStatus   = validStatuses.includes(status)     ? status   : 'To Do';

  try {
    const { rows } = await pool.query(
      `INSERT INTO tasks (employee_id, title, description, project_name, priority, status, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        empId,
        title.trim(),
        description?.trim() || null,
        project_name?.trim() || null,
        finalPriority,
        finalStatus,
        due_date || null,
      ]
    );

    sendSuccess(res, rows[0], 'Task created successfully', 201);
  } catch (err) {
    console.error('[Tasks] createTask error:', err.message);
    sendError(res, 'Failed to create task', 500, err.message);
  }
};

// ── PATCH /api/tasks/:id — update task fields ────────────────
export const updateTask = async (req, res) => {
  const empId  = req.user.employeeId;
  const taskId = parseInt(req.params.id, 10);

  if (!taskId) return sendError(res, 'Invalid task ID', 400);

  const allowed = ['title', 'description', 'project_name', 'priority', 'status', 'due_date'];
  const updates = {};

  // Only include allowed fields from body
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (!Object.keys(updates).length) {
    return sendError(res, 'No valid fields to update', 400);
  }

  try {
    // Verify the task belongs to this employee
    const check = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND employee_id = $2',
      [taskId, empId]
    );
    if (!check.rows.length) return sendError(res, 'Task not found', 404);

    // Build dynamic SET clause
    const setClauses = Object.keys(updates).map((key, i) => `${key} = $${i + 3}`);
    const values     = [taskId, empId, ...Object.values(updates)];

    const { rows } = await pool.query(
      `UPDATE tasks SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $1 AND employee_id = $2
       RETURNING *`,
      values
    );

    sendSuccess(res, rows[0], 'Task updated successfully');
  } catch (err) {
    console.error('[Tasks] updateTask error:', err.message);
    sendError(res, 'Failed to update task', 500, err.message);
  }
};

// ── DELETE /api/tasks/:id — delete a task ───────────────────
export const deleteTask = async (req, res) => {
  const empId  = req.user.employeeId;
  const taskId = parseInt(req.params.id, 10);

  if (!taskId) return sendError(res, 'Invalid task ID', 400);

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND employee_id = $2',
      [taskId, empId]
    );

    if (!rowCount) return sendError(res, 'Task not found', 404);

    sendSuccess(res, null, 'Task deleted successfully');
  } catch (err) {
    console.error('[Tasks] deleteTask error:', err.message);
    sendError(res, 'Failed to delete task', 500, err.message);
  }
};
