/**
 * Designation Controller
 * CRUD operations for Designation Master
 */

const { validationResult } = require('express-validator');
const prisma = require('../config/prisma');

// ─── Get All Designations ────────────────────────────────────
const getAllDesignations = async (req, res) => {
  try {
    const designations = await prisma.designation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: designations });
  } catch (error) {
    console.error('Get designations error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Get Designation By ID ───────────────────────────────────
const getDesignationById = async (req, res) => {
  const { id } = req.params;
  try {
    const designation = await prisma.designation.findUnique({ where: { id: parseInt(id) } });
    if (!designation) {
      return res.status(404).json({ success: false, message: 'Designation not found.' });
    }
    return res.status(200).json({ success: true, data: designation });
  } catch (error) {
    console.error('Get designation error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Create Designation ──────────────────────────────────────
const createDesignation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { desigName, status = 'active' } = req.body;

  try {
    const existing = await prisma.designation.findUnique({ where: { desigName } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Designation already exists.' });
    }

    const designation = await prisma.designation.create({
      data: { desigName, status },
    });
    return res.status(201).json({ success: true, message: 'Designation created.', data: designation });
  } catch (error) {
    console.error('Create designation error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Update Designation ──────────────────────────────────────
const updateDesignation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { id } = req.params;
  const { desigName, status } = req.body;

  try {
    const existing = await prisma.designation.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Designation not found.' });
    }

    const designation = await prisma.designation.update({
      where: { id: parseInt(id) },
      data: { desigName, status },
    });
    return res.status(200).json({ success: true, message: 'Designation updated.', data: designation });
  } catch (error) {
    console.error('Update designation error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Delete Designation ──────────────────────────────────────
const deleteDesignation = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.designation.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Designation not found.' });
    }

    await prisma.designation.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ success: true, message: 'Designation deleted.' });
  } catch (error) {
    console.error('Delete designation error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  getAllDesignations,
  getDesignationById,
  createDesignation,
  updateDesignation,
  deleteDesignation,
};
