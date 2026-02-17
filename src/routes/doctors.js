const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');

// GET /api/doctors/:id/patients - distinct patients this doctor has seen
router.get('/:id/patients', auth, async (req, res) => {
  try {
    // Only allow access to own data or admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get all appointments for this doctor
    const appointments = await Appointment.find({ doctorId: req.params.id })
      .populate('patientId', 'name email universalId phone bloodType condition riskStatus')
      .sort('-date');

    // Extract unique patients (using patientId)
    const patientMap = new Map();
    appointments.forEach(apt => {
      if (apt.patientId && !patientMap.has(apt.patientId._id.toString())) {
        patientMap.set(apt.patientId._id.toString(), apt.patientId);
      }
    });

    const patients = Array.from(patientMap.values());
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/doctors/:id/appointments/today - today's appointments
router.get('/:id/appointments/today', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const appointments = await Appointment.find({
      doctorId: req.params.id,
      date: { $gte: start, $lt: end },
      status: { $in: ['scheduled', 'confirmed'] }
    }).populate('patientId', 'name universalId');

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/doctors/:id/alerts - all alerts for this doctor's patients
router.get('/:id/alerts', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // First get all patients this doctor has seen
    const appointments = await Appointment.find({ doctorId: req.params.id }).distinct('patientId');
    const patientIds = appointments.map(id => id.toString());

    // Get all alerts for those patients, sorted by date
    const alerts = await Alert.find({ patientId: { $in: patientIds } })
      .populate('patientId', 'name')
      .sort('-createdAt')
      .limit(50);

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/doctors/:id/patients/:patientId - full patient data
router.get('/:id/patients/:patientId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if this doctor has ever seen this patient
    const hasAppointment = await Appointment.exists({
      doctorId: req.params.id,
      patientId: req.params.patientId
    });

    if (!hasAppointment && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You have no relationship with this patient' });
    }

    // Fetch patient with all related data
    const patient = await User.findById(req.params.patientId).select('-password');
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const [measurements, medications, labs, imaging, visits, messages] = await Promise.all([
      Measurement.find({ patientId: req.params.patientId }).sort('-recordedAt').limit(50),
      Medication.find({ patientId: req.params.patientId, active: true }),
      Lab.find({ patientId: req.params.patientId }).sort('-date').limit(20),
      ImagingStudy.find({ patientId: req.params.patientId }).sort('-date').limit(20),
      Visit.find({ patientId: req.params.patientId }).populate('doctorId', 'name').sort('-date'),
      Message.find({
        $or: [
          { patientId: req.params.patientId, senderType: 'doctor' },
          { patientId: req.params.patientId, senderType: 'patient' }
        ]
      }).sort('-createdAt').limit(50)
    ]);

    res.json({
      patient,
      measurements,
      medications,
      labs,
      imaging,
      visits,
      messages
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;