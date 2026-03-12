/**
 * Candidate Controller
 * Handles candidate registration (2-step), activation, CRUD (admin), and profile
 */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const prisma = require('../config/prisma');
const { sendActivationEmail } = require('../services/email.service');

// ─── Step 1: Register Basic Details ─────────────────────────
const registerStep1 = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { firstName, lastName, email, phone } = req.body;

  try {
    // Check if email already registered
    const existing = await prisma.candidate.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Store step 1 data in session or return to frontend to carry forward
    return res.status(200).json({
      success: true,
      message: 'Step 1 completed. Proceed to Step 2.',
      data: { firstName, lastName, email, phone },
    });
  } catch (error) {
    console.error('Register step 1 error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Step 2: Register Professional Details & Send Email ──────
const registerStep2 = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { firstName, lastName, email, phone, countryId, qualificationId, designationId, password } = req.body;

  try {
    // Check duplicate email
    const existing = await prisma.candidate.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate activation token
    const activationToken = uuidv4();

    // Create candidate in DB
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        activationToken,
        status: 'pending',
        countryId: parseInt(countryId),
        qualificationId: parseInt(qualificationId),
        designationId: parseInt(designationId),
      },
    });

    // Send activation email (non-blocking, log error if fails)
    try {
      await sendActivationEmail(email, firstName, activationToken);
    } catch (emailError) {
      console.error('Email send error:', emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to activate your account.',
      data: { id: candidate.id, email: candidate.email },
    });
  } catch (error) {
    console.error('Register step 2 error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Activate Candidate Account ──────────────────────────────
const activateAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const candidate = await prisma.candidate.findUnique({
      where: { activationToken: token },
    });

    if (!candidate) {
      return res.status(400).json({ success: false, message: 'Invalid or expired activation link.' });
    }

    if (candidate.status === 'active') {
      return res.status(200).json({ success: true, message: 'Account already activated. You can login.' });
    }

    // Activate the account
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: { status: 'active', activationToken: null },
    });

    return res.status(200).json({
      success: true,
      message: 'Account activated successfully! You can now login.',
    });
  } catch (error) {
    console.error('Activation error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Admin: Get All Candidates ───────────────────────────────
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      // include: {
      //   country: true,
      //   qualification: true,
      //   designation: true,
      // },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        country: { select: { id: true, countryName: true } },
        qualification: { select: { id: true, qualName: true } },
        designation: { select: { id: true, desigName: true } },
      },
    });
    return res.status(200).json({ success: true, data: candidates });
  } catch (error) {
    console.error('Get candidates error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Admin: Get Candidate By ID ──────────────────────────────
const getCandidateById = async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        countryId: true,
        qualificationId: true,
        designationId: true,
        country: { select: { id: true, countryName: true } },
        qualification: { select: { id: true, qualName: true } },
        designation: { select: { id: true, desigName: true } },
      },
    });

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    return res.status(200).json({ success: true, data: candidate });
  } catch (error) {
    console.error('Get candidate error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Admin: Create Candidate ─────────────────────────────────
const createCandidate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { firstName, lastName, email, phone, countryId, qualificationId, designationId, status = 'active' } = req.body;

  try {
    const existing = await prisma.candidate.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const candidate = await prisma.candidate.create({
      data: {
        firstName, lastName, email, phone, status,
        countryId: countryId ? parseInt(countryId) : null,
        qualificationId: qualificationId ? parseInt(qualificationId) : null,
        designationId: designationId ? parseInt(designationId) : null,
      },
    });

    return res.status(201).json({ success: true, message: 'Candidate created.', data: candidate });
  } catch (error) {
    console.error('Create candidate error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Admin: Update Candidate ─────────────────────────────────
const updateCandidate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { id } = req.params;
  const { firstName, lastName, email, phone, countryId, qualificationId, designationId, status } = req.body;

  try {
    const existing = await prisma.candidate.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    const candidate = await prisma.candidate.update({
      where: { id: parseInt(id) },
      data: {
        firstName, lastName, email, phone, status,
        countryId: countryId ? parseInt(countryId) : null,
        qualificationId: qualificationId ? parseInt(qualificationId) : null,
        designationId: designationId ? parseInt(designationId) : null,
      },
    });

    return res.status(200).json({ success: true, message: 'Candidate updated.', data: candidate });
  } catch (error) {
    console.error('Update candidate error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Admin: Delete Candidate ─────────────────────────────────
const deleteCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.candidate.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    await prisma.candidate.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ success: true, message: 'Candidate deleted.' });
  } catch (error) {
    console.error('Delete candidate error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  registerStep1,
  registerStep2,
  activateAccount,
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
};
