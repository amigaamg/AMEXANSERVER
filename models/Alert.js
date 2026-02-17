const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null for system-wide
  type: String,
  severity: { type: String, enum: ['critical', 'warning', 'info'] },
  message: String,
  data: Object,
  isRead: { type: Boolean, default: false },
  expiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);