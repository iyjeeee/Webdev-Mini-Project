/**
 * Send a successful JSON response
 * @param {Response} res  - Express response object
 * @param {*}        data - Response payload
 * @param {string}   message - Optional human-readable message
 * @param {number}   status  - HTTP status code (default 200)
 */
export const sendSuccess = (res, data, message = 'Success', status = 200) => {
  res.status(status).json({ success: true, message, data });
};

/**
 * Send an error JSON response
 * @param {Response} res    - Express response object
 * @param {string}   message - Human-readable error message
 * @param {number}   status  - HTTP status code (default 500)
 * @param {*}        details - Optional error details (dev only)
 */
export const sendError = (res, message = 'Internal server error', status = 500, details = null) => {
  const body = { success: false, message };
  if (details && process.env.NODE_ENV === 'development') body.details = details; // expose details in dev
  res.status(status).json(body);
};

/**
 * Send a paginated data response
 * @param {Response} res        - Express response object
 * @param {Array}    rows       - Array of records for the current page
 * @param {number}   total      - Total record count (for pagination meta)
 * @param {number}   page       - Current page number (1-based)
 * @param {number}   pageSize   - Records per page
 */
export const sendPaginated = (res, rows, total, page, pageSize) => {
  const totalPages = Math.ceil(total / pageSize) || 1; // at least 1 page
  res.status(200).json({
    success:    true,
    data:       rows,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
    },
  });
};
