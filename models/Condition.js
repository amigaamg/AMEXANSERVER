const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // e.g., "Hypertension", "Diabetes"
  icd10Code: String,
  diagnosedDate: Date,
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Condition', conditionSchema);