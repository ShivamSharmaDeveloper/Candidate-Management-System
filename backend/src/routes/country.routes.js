/**
 * Country Routes (Admin Protected)
 * GET    /api/countries        — Get all countries (public for dropdowns)
 * GET    /api/countries/:id    — Get one country
 * POST   /api/countries        — Create country (admin)
 * PUT    /api/countries/:id    — Update country (admin)
 * DELETE /api/countries/:id    — Delete country (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { verifyAdminToken } = require('../middleware/authMiddleware');
const {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
} = require('../controllers/country.controller');

// ─── Validation Rules ────────────────────────────────────────
const countryValidation = [
  body('countryName').trim().notEmpty().withMessage('Country name is required.').isLength({ min: 2, max: 100 }).withMessage('Country name must be between 2 and 100 characters.'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive.'),
];

// ─── Routes ──────────────────────────────────────────────────
router.get('/', getAllCountries);                             // Public (for dropdowns)
router.get('/:id', getCountryById);                          // Public
router.post('/', verifyAdminToken, countryValidation, createCountry);
router.put('/:id', verifyAdminToken, countryValidation, updateCountry);
router.delete('/:id', verifyAdminToken, deleteCountry);

module.exports = router;
