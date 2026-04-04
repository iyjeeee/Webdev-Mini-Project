import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── POST /api/auth/login ──────────────────────────────────────
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400);
  }

  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.email, u.password, u.is_active,
              e.id AS employee_id, e.first_name, e.last_name,
              e.employee_no, e.profile_photo_url,
              jp.title AS job_position, d.name AS department
       FROM users u
       JOIN employees e ON e.id = u.employee_id
       LEFT JOIN job_positions jp ON jp.id = e.job_position_id
       LEFT JOIN departments    d ON d.id  = e.department_id
       WHERE u.email = $1`,
      [email.toLowerCase().trim()]
    );

    if (!rows.length) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const user = rows[0];

    if (!user.is_active) {
      return sendError(res, 'Account is deactivated. Contact HR.', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const token = jwt.sign(
      { userId: user.id, employeeId: user.employee_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    sendSuccess(res, {
      token,
      user: {
        id:              user.id,
        employeeId:      user.employee_id,
        email:           user.email,
        employeeNo:      user.employee_no,
        firstName:       user.first_name,
        lastName:        user.last_name,
        fullName:        `${user.first_name} ${user.last_name}`,
        jobPosition:     user.job_position,
        department:      user.department,
        profilePhotoUrl: user.profile_photo_url,
      },
    }, 'Login successful');
  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    sendError(res, 'Server error during login', 500, err.message);
  }
};

// ── POST /api/auth/forgot-password ───────────────────────────
// Note: password_reset_tokens table was removed in schema v2.
// This endpoint now just returns a success message (manual reset via IT).
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, 'Email is required', 400);

  // Always return success to prevent email enumeration
  sendSuccess(res, null, 'If that email exists, please contact IT support to reset your password.');
};

// ── POST /api/auth/reset-password ────────────────────────────
// Disabled: password_reset_tokens table removed in schema v2
export const resetPassword = async (req, res) => {
  sendError(res, 'Password reset is handled manually by IT support.', 400);
};
