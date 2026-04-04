import pool from '../utils/db.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

// ── GET /api/event-types ──────────────────────────────────────
export const getEventTypes = async (req, res) => {
  const page     = Math.max(1, parseInt(req.query.page, 10)     || 1);
  const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 10);

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM event_types WHERE is_active = TRUE`
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const offset = (page - 1) * pageSize;
    const { rows } = await pool.query(
      `SELECT
         et.id, et.name, et.color, et.is_active,
         COALESCE(ev.event_count, 0) AS total_events
       FROM event_types et
       LEFT JOIN (
         SELECT event_type_id, COUNT(*) AS event_count
         FROM calendar_events
         WHERE is_active = TRUE
         GROUP BY event_type_id
       ) ev ON ev.event_type_id = et.id
       WHERE et.is_active = TRUE
       ORDER BY et.id
       LIMIT $1 OFFSET $2`,
      [pageSize, offset]
    );

    sendPaginated(res, rows, total, page, pageSize);
  } catch (err) {
    console.error('[EventType] getEventTypes error:', err.message);
    sendError(res, 'Failed to fetch event types', 500, err.message);
  }
};

// ── GET /api/event-types/stats ────────────────────────────────
export const getEventTypeStats = async (req, res) => {
  try {
    const [totalRes, thisMonthRes] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM event_types WHERE is_active = TRUE`),
      pool.query(
        `SELECT COUNT(DISTINCT ce.id) AS count
         FROM calendar_events ce
         WHERE is_active = TRUE
           AND TO_CHAR(ce.start_date, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')`
      ),
    ]);

    sendSuccess(res, {
      total:           parseInt(totalRes.rows[0].count, 10),
      activeTypes:     parseInt(totalRes.rows[0].count, 10),
      eventsThisMonth: parseInt(thisMonthRes.rows[0].count, 10),
    });
  } catch (err) {
    console.error('[EventType] getEventTypeStats error:', err.message);
    sendError(res, 'Failed to fetch event type stats', 500, err.message);
  }
};

// ── POST /api/event-types ─────────────────────────────────────
// Fixed: removed description and applies_to (not in schema)
export const createEventType = async (req, res) => {
  const { name, color } = req.body;

  if (!name?.trim()) return sendError(res, 'Event type name is required', 400);

  try {
    const dupCheck = await pool.query(
      `SELECT id FROM event_types WHERE LOWER(name) = LOWER($1)`, [name.trim()]
    );
    if (dupCheck.rows.length) {
      return sendError(res, 'An event type with this name already exists', 409);
    }

    const { rows } = await pool.query(
      `INSERT INTO event_types (name, color)
       VALUES ($1, $2)
       RETURNING id, name, color, is_active`,
      [name.trim(), color || '#000000']
    );

    sendSuccess(res, rows[0], 'Event type created', 201);
  } catch (err) {
    console.error('[EventType] createEventType error:', err.message);
    sendError(res, 'Failed to create event type', 500, err.message);
  }
};

// ── PATCH /api/event-types/:id/toggle ────────────────────────
// Fixed: removed updated_at (not in schema)
export const toggleEventType = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `UPDATE event_types
       SET is_active = NOT is_active
       WHERE id = $1
       RETURNING id, name, is_active`,
      [id]
    );
    if (!rows.length) return sendError(res, 'Event type not found', 404);
    sendSuccess(res, rows[0], `Event type ${rows[0].is_active ? 'activated' : 'deactivated'}`);
  } catch (err) {
    console.error('[EventType] toggleEventType error:', err.message);
    sendError(res, 'Failed to update event type', 500, err.message);
  }
};
