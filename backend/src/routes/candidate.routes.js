/**
 * Candidate Routes
 *
 * Public Routes:
 *   POST /api/candidates/register/step1   — Validate step 1
 *   POST /api/candidates/register/step2   — Complete registration + send email
 *   GET  /api/candidates/activate/:token  — Activate account
 *
 * Admin Protected:
 *   GET    /api/candidates               — Get all candidates
 *   GET    /api/candidates/:id           — Get one
 *   POST   /api/candidates               — Create candidate
 *   PUT    /api/candidates/:id           — Update candidate
 *   DELETE /api/candidates/:id           — Delete candidate
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { verifyAdminToken } = require('../middleware/authMiddleware');
const {
  registerStep1,
  registerStep2,
  activateAccount,
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} = require('../controllers/candidate.controller');

// ─── Validation Rules ────────────────────────────────────────
const step1Validation = [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('lastName').trim().notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^[0-9+\-\s]{7,15}$/).withMessage('Invalid phone number.'),
];

const step2Validation = [
  ...step1Validation,
  body('countryId').notEmpty().withMessage('Country is required.').isInt({ min: 1 }),
  body('qualificationId').notEmpty().withMessage('Qualification is required.').isInt({ min: 1 }),
  body('designationId').notEmpty().withMessage('Designation is required.').isInt({ min: 1 }),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must have uppercase, lowercase, and number.'),
];

const adminCandidateValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('lastName').trim().notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  body('phone').trim().notEmpty().withMessage('Phone is required.'),
];

// ─── Public Routes ───────────────────────────────────────────
router.post('/register/step1', step1Validation, registerStep1);
router.post('/register/step2', step2Validation, registerStep2);
router.get('/activate/:token', activateAccount);

// ─── Admin Protected Routes ──────────────────────────────────
router.get('/', verifyAdminToken, getAllCandidates);
router.get('/:id', verifyAdminToken, getCandidateById);
router.post('/', verifyAdminToken, adminCandidateValidation, createCandidate);
router.put('/:id', verifyAdminToken, adminCandidateValidation, updateCandidate);
router.delete('/:id', verifyAdminToken, deleteCandidate);

module.exports = router;
