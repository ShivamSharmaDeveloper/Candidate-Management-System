/**
 * Express App Configuration
 * Sets up middleware, routes, and error handling
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// ─── Import Routes ───────────────────────────────────────────
const authRoutes = require('./src/routes/auth.routes');
const countryRoutes = require('./src/routes/country.routes');
const qualificationRoutes = require('./src/routes/qualification.routes');
const designationRoutes = require('./src/routes/designation.routes');
const candidateRoutes = require('./src/routes/candidate.routes');

const app = express();

// ─── CORS ────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// ─── Body Parsers ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Candidate Management API is running.', timestamp: new Date() });
});

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/qualifications', qualificationRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/candidates', candidateRoutes);

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
});

module.exports = app;
