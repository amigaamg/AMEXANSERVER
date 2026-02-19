const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  priority: { type: String, enum: ['routine', 'urgent'], default: 'routine' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'rejected'],
    default: 'pending',
  },
  notes: String,
  acceptedAt: Date,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Referral', referralSchema);