const express = require('express');
const router = express.Router({ mergeParams: true }); // to get patientId from URL
const auth = require('../middleware/auth');
const MedicalHistory = require('../models/MedicalHistory');
const VisitNote = require('../models/VisitNote');
const Measurement = require('../models/Measurement');
const Alert = require('../models/Alert');
const User = require('../models/User');

// Helper to check access: user is patient themselves or a doctor
const canAccess = (reqUser, targetPatientId) => {
  return reqUser.role === 'doctor' || reqUser._id.toString() === targetPatientId;
};

// ------------------ History ------------------
router.get('/:patientId/history', auth, async (req, res) => {
  const { patientId } = req.params;
  if (!canAccess(req.user, patientId)) return res.status(403).json({ error: 'Access denied' });
  try {
    const history = await MedicalHistory.findOne({ patientId }).sort('-version').populate('authorId', 'name');
    res.json(history || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:patientId/history', auth, async (req, res) => {
  const { patientId } = req.params;
  if (req.user.role !== 'doctor') return res.status(403).json({ error: 'Only doctors can create history' });
  const { data } = req.body;
  try {
    const latest = await MedicalHistory.findOne({ patientId }).sort('-version');
    const version = latest ? latest.version + 1 : 1;
    // Simple signature (use actual crypto in production)
    const signature = require('crypto').createHash('sha256')
      .update(JSON.stringify({ patientId, authorId: req.user._id, data, version }))
      .digest('hex');
    const history = new MedicalHistory({ patientId, authorId: req.user._id, version, data, signature });
    await history.save();
    res.status(201).json({ success: true, version });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ Visit Notes ------------------
router.get('/:patientId/visits', auth, async (req, res) => {
  const { patientId } = req.params;
  if (!canAccess(req.user, patientId)) return res.status(403).json({ error: 'Access denied' });
  try {
    const visits = await VisitNote.find({ patientId }).populate('doctorId', 'name').sort('-date');
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:patientId/visits', auth, async (req, res) => {
  const { patientId } = req.params;
  if (req.user.role !== 'doctor') return res.status(403).json({ error: 'Only doctors can create visit notes' });
  const visitData = { ...req.body, patientId, doctorId: req.user._id };
  try {
    const visit = new VisitNote(visitData);
    await visit.save();
    res.status(201).json(visit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ Measurements ------------------
router.get('/:patientId/measurements', auth, async (req, res) => {
  const { patientId } = req.params;
  if (!canAccess(req.user, patientId)) return res.status(403).json({ error: 'Access denied' });
  const { type, limit = 20 } = req.query;
  const filter = { patientId };
  if (type) filter.type = type;
  try {
    const measurements = await Measurement.find(filter).sort('-createdAt').limit(Number(limit));
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:patientId/measurements', auth, async (req, res) => {
  const { patientId } = req.params;
  if (!canAccess(req.user, patientId)) return res.status(403).json({ error: 'Access denied' });
  const measData = { ...req.body, patientId, source: req.user.role === 'patient' ? 'patient' : 'doctor' };
  try {
    const measurement = new Measurement(measData);
    // Attach socket to measurement for post-save hook (optional)
    measurement.$socket = req.io ? { io: req.io } : null;
    await measurement.save();
    res.status(201).json(measurement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ Alerts ------------------
router.get('/:patientId/alerts', auth, async (req, res) => {
  const { patientId } = req.params;
  if (!canAccess(req.user, patientId)) return res.status(403).json({ error: 'Access denied' });
  try {
    const alerts = await Alert.find({ patientId }).sort('-createdAt').limit(50);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:patientId/alerts/:alertId/read', auth, async (req, res) => {
  const { patientId, alertId } = req.params;
  if (!canAccess(req.user, patientId)) return res.status(403).json({ error: 'Access denied' });
  try {
    await Alert.findByIdAndUpdate(alertId, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;