const BASE_URL = import.meta.env.VITE_API_URL || '/api'; // relative = uses Vite proxy in dev

/**
 * Core request helper — attaches JWT from localStorage automatically
 * @param {string} path    - Endpoint path (e.g. '/overtime')
 * @param {object} options - fetch() options (method, body, etc.)
 * @returns {Promise<{data, pagination?}>}
 */
const request = async (path, options = {}) => {
  const token = localStorage.getItem('token'); // read stored JWT

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // attach auth header if token exists
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const json     = await response.json();

  if (!response.ok) {
    // Throw a normalized error object so callers can show the server message
    const err      = new Error(json.message || 'Request failed');
    err.status     = response.status;
    err.serverData = json;
    throw err;
  }

  return json; // { success, message, data, pagination? }
};

// ── Convenience methods ───────────────────────────────────────
export const api = {
  get:    (path, params = {}) => {
    // Build query string from params object
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    return request(`${path}${qs ? `?${qs}` : ''}`);
  },
  post:   (path, body)  => request(path, { method: 'POST',  body: JSON.stringify(body) }),
  patch:  (path, body)  => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path)        => request(path, { method: 'DELETE' }),
};

export default api;
