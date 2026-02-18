const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ── Inline models (reuse existing collections) ──────────────────────────────

// Reuse User model if already registered, otherwise define it
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['doctor', 'patient'], default: 'patient' },
}, { timestamps: true }));

// Appointment model
const appointmentSchema = new mongoose.Schema({
  patientId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clinicType:    String,
  clinicName:    String,
  date:          String,
  time:          String,
  reason:        String,
  status:        { type: String, enum: ['scheduled', 'confirmed', 'completed', 'cancelled'], default: 'scheduled' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  isFirstVisit:  Boolean,
}, { timestamps: true });

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

// Alert model
const alertSchema = new mongoose.Schema({
  doctorId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  severity:  { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  title:     String,
  message:   String,
  action:    String,
  isRead:    { type: Boolean, default: false },
}, { timestamps: true });

const Alert = mongoose.models.Alert || mongoose.model('Alert', alertSchema);

// ── JWT auth middleware ──────────────────────────────────────────────────────
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(header.replace('Bearer ', ''), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── GET /api/doctors/:id/appointments/today ─────────────────────────────────
router.get('/:id/appointments/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const appointments = await Appointment.find({
      doctorId: req.params.id,
      date: { $regex: `^${today}` },
    }).populate('patientId', 'name email universalId');
    res.json(appointments);
  } catch (err) {
    console.error('Today appointments error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/doctors/:id/patients ───────────────────────────────────────────
router.get('/:id/patients', auth, async (req, res) => {
  try {
    // Get all unique patients who have had appointments with this doctor
    const appointments = await Appointment.find({ doctorId: req.params.id })
      .populate('patientId', 'name email universalId riskStatus condition')
      .lean();

    // Deduplicate by patient ID
    const seen = new Set();
    const patients = [];
    for (const apt of appointments) {
      if (apt.patientId && !seen.has(String(apt.patientId._id))) {
        seen.add(String(apt.patientId._id));
        patients.push(apt.patientId);
      }
    }
    res.json(patients);
  } catch (err) {
    console.error('Patients error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/doctors/:id/alerts ─────────────────────────────────────────────
router.get('/:id/alerts', auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ doctorId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(alerts);
  } catch (err) {
    console.error('Alerts error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/doctors/patients/:patientId  (full patient detail) ──────────────
router.get('/patients/:patientId', auth, async (req, res) => {
  try {
    const patient = await User.findById(req.params.patientId).lean();
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const [appointments, alerts, measurements, medications, labs, messages, visits, imaging] =
      await Promise.all([
        Appointment.find({ patientId: req.params.patientId }).lean().catch(() => []),
        Alert.find({ patientId: req.params.patientId }).lean().catch(() => []),
        mongoose.models.Measurement
          ? mongoose.models.Measurement.find({ patientId: req.params.patientId }).lean().catch(() => [])
          : Promise.resolve([]),
        mongoose.models.Medication
          ? mongoose.models.Medication.find({ patientId: req.params.patientId }).lean().catch(() => [])
          : Promise.resolve([]),
        mongoose.models.Lab
          ? mongoose.models.Lab.find({ patientId: req.params.patientId }).lean().catch(() => [])
          : Promise.resolve([]),
        mongoose.models.Message
          ? mongoose.models.Message.find({ patientId: req.params.patientId }).lean().catch(() => [])
          : Promise.resolve([]),
        mongoose.models.Visit
          ? mongoose.models.Visit.find({ patientId: req.params.patientId }).lean().catch(() => [])
          : Promise.resolve([]),
        mongoose.models.ImagingStudy
          ? mongoose.models.ImagingStudy.find({ patientId: req.params.patientId }).lean().catch(() => [])
          : Promise.resolve([]),
      ]);

    res.json({ patient, appointments, alerts, measurements, medications, labs, messages, visits, imaging });
  } catch (err) {
    console.error('Patient detail error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/doctors/search?q=xxx ───────────────────────────────────────────
router.get('/search', auth, async (req, res) => {
  try {
    const q = req.query.q || '';
    const doctors = await User.find({
      role: 'doctor',
      name: { $regex: q, $options: 'i' },
    }).select('name email').lean();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;