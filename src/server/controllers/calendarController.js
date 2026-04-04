import pool from '../utils/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── GET /api/calendar — all events with optional month/type filter ──
export const getCalendarEvents = async (req, res) => {
  const month  = req.query.month  || ''; // YYYY-MM format
  const typeId = req.query.typeId || ''; // optional event_type_id

  try {
    const conditions = ['ce.is_active = TRUE'];
    const params     = [];
    let   idx        = 1;

    // Filter by month (events starting in that month)
    if (month) {
      conditions.push(`TO_CHAR(ce.start_date, 'YYYY-MM') = $${idx++}`);
      params.push(month);
    }
    // Filter by event type
    if (typeId) {
      conditions.push(`ce.event_type_id = $${idx++}`);
      params.push(parseInt(typeId, 10));
    }

    const where = conditions.join(' AND ');

    const { rows } = await pool.query(
      `SELECT
         ce.id, ce.title, ce.description,
         ce.start_date, ce.end_date,
         TO_CHAR(ce.start_time, 'HH12:MI AM') AS start_time,
         TO_CHAR(ce.end_time,   'HH12:MI AM') AS end_time,
         ce.is_all_day, ce.location,
         et.id    AS event_type_id,
         et.name  AS event_type_name,
         et.color AS event_type_color
       FROM calendar_events ce
       JOIN event_types et ON et.id = ce.event_type_id
       WHERE ${where}
       ORDER BY ce.start_date ASC, ce.start_time ASC NULLS LAST`,
      params
    );

    sendSuccess(res, rows);
  } catch (err) {
    console.error('[Calendar] getCalendarEvents error:', err.message);
    sendError(res, 'Failed to fetch calendar events', 500, err.message);
  }
};

// ── GET /api/calendar/upcoming — next 5 events for dashboard ──
export const getUpcomingEvents = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         ce.id, ce.title,
         ce.start_date, ce.is_all_day, ce.location,
         TO_CHAR(ce.start_time, 'HH12:MI AM') AS start_time,
         et.name  AS event_type_name,
         et.color AS event_type_color
       FROM calendar_events ce
       JOIN event_types et ON et.id = ce.event_type_id
       WHERE ce.is_active = TRUE
         AND ce.start_date >= CURRENT_DATE
       ORDER BY ce.start_date ASC, ce.start_time ASC NULLS LAST
       LIMIT 5`,
      []
    );
    sendSuccess(res, rows);
  } catch (err) {
    console.error('[Calendar] getUpcomingEvents error:', err.message);
    sendError(res, 'Failed to fetch upcoming events', 500, err.message);
  }
};

// ── POST /api/calendar — create new calendar event ───────────
export const createCalendarEvent = async (req, res) => {
  const {
    title, event_type_id, start_date, end_date,
    start_time, end_time, is_all_day, location, description,
  } = req.body;

  if (!title?.trim())    return sendError(res, 'Event title is required', 400);
  if (!event_type_id)    return sendError(res, 'Event type is required',  400);
  if (!start_date)       return sendError(res, 'Start date is required',  400);

  try {
    const { rows } = await pool.query(
      `INSERT INTO calendar_events
         (title, event_type_id, start_date, end_date, start_time, end_time, is_all_day, location, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        title.trim(),
        parseInt(event_type_id, 10),
        start_date,
        end_date  || start_date,
        is_all_day ? null : (start_time || null),
        is_all_day ? null : (end_time   || null),
        !!is_all_day,
        location?.trim()    || null,
        description?.trim() || null,
      ]
    );

    sendSuccess(res, rows[0], 'Event created successfully', 201);
  } catch (err) {
    console.error('[Calendar] createCalendarEvent error:', err.message);
    sendError(res, 'Failed to create event', 500, err.message);
  }
};
