/**
 * Designation Routes (Admin Protected)
 * GET    /api/designations        — Get all (public for dropdowns)
 * GET    /api/designations/:id    — Get one
 * POST   /api/designations        — Create (admin)
 * PUT    /api/designations/:id    — Update (admin)
 * DELETE /api/designations/:id    — Delete (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { verifyAdminToken } = require('../middleware/authMiddleware');
const {
  getAllDesignations,
  getDesignationById,
  createDesignation,
  updateDesignation,
  deleteDesignation,
} = require('../controllers/designation.controller');

// ─── Validation Rules ────────────────────────────────────────
const desigValidation = [
  body('desigName').trim().notEmpty().withMessage('Designation name is required.').isLength({ min: 2, max: 100 }),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive.'),
];

// ─── Routes ──────────────────────────────────────────────────
router.get('/', getAllDesignations);
router.get('/:id', getDesignationById);
router.post('/', verifyAdminToken, desigValidation, createDesignation);
router.put('/:id', verifyAdminToken, desigValidation, updateDesignation);
router.delete('/:id', verifyAdminToken, deleteDesignation);

module.exports = router;
