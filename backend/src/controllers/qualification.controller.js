/**
 * Qualification Controller
 * CRUD operations for Qualification Master
 */

const { validationResult } = require('express-validator');
const prisma = require('../config/prisma');

// ─── Get All Qualifications ──────────────────────────────────
const getAllQualifications = async (req, res) => {
  try {
    const qualifications = await prisma.qualification.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: qualifications });
  } catch (error) {
    console.error('Get qualifications error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Get Qualification By ID ─────────────────────────────────
const getQualificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const qualification = await prisma.qualification.findUnique({ where: { id: parseInt(id) } });
    if (!qualification) {
      return res.status(404).json({ success: false, message: 'Qualification not found.' });
    }
    return res.status(200).json({ success: true, data: qualification });
  } catch (error) {
    console.error('Get qualification error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Create Qualification ────────────────────────────────────
const createQualification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { qualName, status = 'active' } = req.body;

  try {
    const existing = await prisma.qualification.findUnique({ where: { qualName } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Qualification already exists.' });
    }

    const qualification = await prisma.qualification.create({
      data: { qualName, status },
    });
    return res.status(201).json({ success: true, message: 'Qualification created.', data: qualification });
  } catch (error) {
    console.error('Create qualification error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Update Qualification ────────────────────────────────────
const updateQualification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { id } = req.params;
  const { qualName, status } = req.body;

  try {
    const existing = await prisma.qualification.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Qualification not found.' });
    }

    const qualification = await prisma.qualification.update({
      where: { id: parseInt(id) },
      data: { qualName, status },
    });
    return res.status(200).json({ success: true, message: 'Qualification updated.', data: qualification });
  } catch (error) {
    console.error('Update qualification error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Delete Qualification ────────────────────────────────────
const deleteQualification = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.qualification.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Qualification not found.' });
    }

    await prisma.qualification.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ success: true, message: 'Qualification deleted.' });
  } catch (error) {
    console.error('Delete qualification error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  getAllQualifications,
  getQualificationById,
  createQualification,
  updateQualification,
  deleteQualification,
};
