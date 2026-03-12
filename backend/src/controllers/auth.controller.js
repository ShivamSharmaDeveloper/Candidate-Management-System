/**
 * Auth Controller
 * Handles admin login and candidate login
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const prisma = require('../config/prisma');

// ─── Generate JWT Token ──────────────────────────────────────
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── Admin Login ─────────────────────────────────────────────
const adminLogin = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate token
    const token = generateToken({ id: admin.id, email: admin.email, role: 'admin' });

    return res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Candidate Login ─────────────────────────────────────────
const candidateLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find candidate by email
    const candidate = await prisma.candidate.findUnique({
      where: { email },
      include: {
        country: true,
        qualification: true,
        designation: true,
      },
    });

    if (!candidate) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check if account is active
    if (candidate.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Account not activated. Please check your email for the activation link.',
      });
    }

    if (candidate.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Account is pending activation. Please check your email.',
      });
    }

    // Check password
    if (!candidate.passwordHash) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, candidate.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate token
    const token = generateToken({ id: candidate.id, email: candidate.email, role: 'candidate' });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      candidate: {
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        status: candidate.status,
        country: candidate.country,
        qualification: candidate.qualification,
        designation: candidate.designation,
      },
    });
  } catch (error) {
    console.error('Candidate login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { adminLogin, candidateLogin };
