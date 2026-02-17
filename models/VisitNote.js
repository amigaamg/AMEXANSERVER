const mongoose = require('mongoose');

const visitNoteSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  clinicType: String,
  date: Date,
  reason: String,
  findings: String,
  diagnosis: String,
  treatment: String,
  orders: [String],
  attachments: [String],
}, { timestamps: true });

module.exports = mongoose.model('VisitNote', visitNoteSchema);