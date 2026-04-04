import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

const auth = (req, res, next) => {
  // Extract token from Authorization: Bearer <token> header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Unauthorized — missing or invalid token', 401);
  }

  const token = authHeader.split(' ')[1]; // extract the token part

  try {
    // Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach { userId, employeeId, email } to request
    next();
  } catch (err) {
    // Distinguish expired vs invalid tokens for better client messaging
    const message = err.name === 'TokenExpiredError'
      ? 'Session expired — please log in again'
      : 'Unauthorized — invalid token';
    return sendError(res, message, 401);
  }
};

export default auth;
