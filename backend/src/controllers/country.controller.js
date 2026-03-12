/**
 * Country Controller
 * CRUD operations for Country Master
 */

const { validationResult } = require('express-validator');
const prisma = require('../config/prisma');

// ─── Get All Countries ───────────────────────────────────────
const getAllCountries = async (req, res) => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: countries });
  } catch (error) {
    console.error('Get countries error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Get Country By ID ───────────────────────────────────────
const getCountryById = async (req, res) => {
  const { id } = req.params;
  try {
    const country = await prisma.country.findUnique({ where: { id: parseInt(id) } });
    if (!country) {
      return res.status(404).json({ success: false, message: 'Country not found.' });
    }
    return res.status(200).json({ success: true, data: country });
  } catch (error) {
    console.error('Get country error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Create Country ──────────────────────────────────────────
const createCountry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { countryName, status = 'active' } = req.body;

  try {
    // Check duplicate
    const existing = await prisma.country.findUnique({ where: { countryName } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Country already exists.' });
    }

    const country = await prisma.country.create({
      data: { countryName, status },
    });
    return res.status(201).json({ success: true, message: 'Country created.', data: country });
  } catch (error) {
    console.error('Create country error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Update Country ──────────────────────────────────────────
const updateCountry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { id } = req.params;
  const { countryName, status } = req.body;

  try {
    const existing = await prisma.country.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Country not found.' });
    }

    const country = await prisma.country.update({
      where: { id: parseInt(id) },
      data: { countryName, status },
    });
    return res.status(200).json({ success: true, message: 'Country updated.', data: country });
  } catch (error) {
    console.error('Update country error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Delete Country ──────────────────────────────────────────
const deleteCountry = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.country.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Country not found.' });
    }

    await prisma.country.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ success: true, message: 'Country deleted.' });
  } catch (error) {
    console.error('Delete country error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { getAllCountries, getCountryById, createCountry, updateCountry, deleteCountry };
