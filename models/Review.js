const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

// Ensure one review per appointment per patient (optional, but good)
reviewSchema.index({ doctorId: 1, patientId: 1, appointmentId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);