const express = require('express');
const router = express.Router();
const Clinic = require('../models/Clinic');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all clinics (public, for booking)
router.get('/', async (req, res) => {
  try {
    const clinics = await Clinic.find().populate('doctorId', 'name email');
    res.json(clinics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get clinics by doctor ID
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const clinics = await Clinic.find({ doctorId: req.params.doctorId });
    res.json(clinics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a clinic (doctor only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ error: 'Access denied' });
  const clinicData = { ...req.body, doctorId: req.user._id };
  try {
    const clinic = new Clinic(clinicData);
    await clinic.save();
    res.status(201).json(clinic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update clinic
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ error: 'Access denied' });
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) return res.status(404).json({ error: 'Clinic not found' });
    if (clinic.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not your clinic' });
    }
    Object.assign(clinic, req.body);
    await clinic.save();
    res.json(clinic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;