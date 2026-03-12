/**
 * Auth Routes
 * POST /api/auth/admin/login   — Admin login
 * POST /api/auth/candidate/login — Candidate login
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { adminLogin, candidateLogin } = require('../controllers/auth.controller');

// ─── Validation Rules ────────────────────────────────────────
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

// ─── Admin Login ─────────────────────────────────────────────
router.post('/admin/login', loginValidation, adminLogin);

// ─── Candidate Login ─────────────────────────────────────────
router.post('/candidate/login', loginValidation, candidateLogin);

module.exports = router;
