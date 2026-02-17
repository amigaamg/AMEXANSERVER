const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String, // 'bp', 'weight', 'glucose'
  value: Object, // { systolic, diastolic } for BP
  unit: String,
  source: { type: String, enum: ['patient', 'doctor', 'device'] },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Measurement', measurementSchema);