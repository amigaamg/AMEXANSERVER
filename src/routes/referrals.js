const express = require('express');
const router = express.Router();
const Referral = require('../models/Referral');
const auth = require('../middleware/auth');

// POST /api/referrals - create a new referral
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can refer' });
    }

    const { patientId, toDoctorId, reason, priority } = req.body;

    const referral = new Referral({
      fromDoctorId: req.user._id,
      toDoctorId,
      patientId,
      reason,
      priority: priority || 'routine',
      status: 'pending'
    });

    await referral.save();
    res.status(201).json(referral);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/doctors/search - search doctors by name or specialty
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const doctors = await User.find({
      role: 'doctor',
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { specialty: { $regex: q, $options: 'i' } }
      ]
    }).select('name specialty email').limit(20);

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;