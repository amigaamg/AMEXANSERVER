const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create appointment (patient only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'patient') return res.status(403).json({ error: 'Only patients can book' });
  const { doctorId, clinicType, date, triageAnswers } = req.body;
  try {
    const previous = await Appointment.findOne({ patientId: req.user._id, doctorId });
    const isFirstVisit = !previous;
    const appointment = new Appointment({
      patientId: req.user._id,
      doctorId,
      clinicType,
      date,
      isFirstVisit,
      triageAnswers,
    });
    await appointment.save();
    // Populate doctor info for response
    await appointment.populate('doctorId', 'name email');
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get appointments for patient
router.get('/patient/:patientId', auth, async (req, res) => {
  if (req.user.role !== 'patient' && req.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name email')
      .sort('-date');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get today's appointments for doctor
router.get('/doctor/today', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ error: 'Access denied' });
  const start = new Date();
  start.setHours(0,0,0,0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  try {
    const appointments = await Appointment.find({
      doctorId: req.user._id,
      date: { $gte: start, $lt: end },
      status: 'scheduled',
    }).populate('patientId', 'name universalId');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all upcoming appointments for doctor (beyond today)
router.get('/doctor/upcoming', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ error: 'Access denied' });
  const today = new Date();
  today.setHours(0,0,0,0);
  try {
    const appointments = await Appointment.find({
      doctorId: req.user._id,
      date: { $gte: today },
      status: 'scheduled',
    }).populate('patientId', 'name universalId').sort('date');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transfer appointment (doctor)
router.put('/:id/transfer', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ error: 'Access denied' });
  const { toDoctorId, reason, refund } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    appointment.transferHistory.push({
      fromDoctorId: req.user._id,
      toDoctorId,
      reason,
      refundProcessed: refund,
    });
    appointment.doctorId = toDoctorId;
    appointment.status = 'scheduled'; // or transferred? keep scheduled for new doc
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
// PUT /api/appointments/:id/transfer - transfer appointment
router.put('/:id/transfer', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can transfer appointments' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    const { toDoctorId, reason, refund } = req.body;

    appointment.transferHistory = appointment.transferHistory || [];
    appointment.transferHistory.push({
      fromDoctorId: req.user._id,
      toDoctorId,
      reason,
      refundProcessed: refund,
      timestamp: new Date()
    });

    appointment.doctorId = toDoctorId;
    appointment.status = 'scheduled'; // keep scheduled for new doctor
    await appointment.save();

    // If refund requested, process via payment system (webhook later)
    if (refund) {
      // Trigger refund logic – could emit event or call payment service
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});