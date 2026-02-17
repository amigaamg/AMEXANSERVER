const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { generatePatientQR } = require('../utils/smartcard');

// Generate smartcard QR for the authenticated patient
router.get('/me', auth, async (req, res) => {
  if (req.user.role !== 'patient') return res.status(403).json({ error: 'Only patients have smartcards' });
  try {
    const patient = await User.findById(req.user._id).select('-password');
    const qrDataURL = await generatePatientQR({
      universalId: patient.universalId,
      name: patient.name,
      dob: patient.dob,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      emergencyContact: patient.emergencyContact,
      conditions: patient.conditions,
      medications: patient.medications,
      lastUpdated: new Date().toISOString(),
    });
    res.json({ qr: qrDataURL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) Doctor scans a patient's smartcard (receives encrypted data and returns decrypted)
router.post('/scan', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ error: 'Only doctors can scan' });
  const { encryptedData } = req.body;
  try {
    const { parsePatientQR } = require('../utils/smartcard');
    const patientData = parsePatientQR(encryptedData);
    res.json(patientData);
  } catch (err) {
    res.status(400).json({ error: 'Invalid QR code' });
  }
});

module.exports = router;