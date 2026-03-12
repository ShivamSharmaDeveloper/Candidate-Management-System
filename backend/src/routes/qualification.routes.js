/**
 * Qualification Routes (Admin Protected)
 * GET    /api/qualifications        — Get all (public for dropdowns)
 * GET    /api/qualifications/:id    — Get one
 * POST   /api/qualifications        — Create (admin)
 * PUT    /api/qualifications/:id    — Update (admin)
 * DELETE /api/qualifications/:id    — Delete (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { verifyAdminToken } = require('../middleware/authMiddleware');
const {
  getAllQualifications,
  getQualificationById,
  createQualification,
  updateQualification,
  deleteQualification,
} = require('../controllers/qualification.controller');

// ─── Validation Rules ────────────────────────────────────────
const qualValidation = [
  body('qualName').trim().notEmpty().withMessage('Qualification name is required.').isLength({ min: 2, max: 100 }),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive.'),
];

// ─── Routes ──────────────────────────────────────────────────
router.get('/', getAllQualifications);
router.get('/:id', getQualificationById);
router.post('/', verifyAdminToken, qualValidation, createQualification);
router.put('/:id', verifyAdminToken, qualValidation, updateQualification);
router.delete('/:id', verifyAdminToken, deleteQualification);

module.exports = router;
