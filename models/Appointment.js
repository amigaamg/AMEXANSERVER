const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clinicType: String,
  date: Date,
  duration: Number,
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'transferred'], default: 'scheduled' },
  isFirstVisit: Boolean,
  triageAnswers: Object,
  transferHistory: [{
    fromDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    refundProcessed: Boolean,
    timestamp: Date,
  }],
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);