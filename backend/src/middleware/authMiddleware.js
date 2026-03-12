/**
 * JWT Authentication Middleware
 * Verifies JWT tokens for protected routes (Admin & Candidate)
 */

const jwt = require('jsonwebtoken');

// ─── Admin Auth Middleware ───────────────────────────────────
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure token is for admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// ─── Candidate Auth Middleware ───────────────────────────────
const verifyCandidateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'candidate') {
      return res.status(403).json({ success: false, message: 'Access denied. Candidates only.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = { verifyAdminToken, verifyCandidateToken };
