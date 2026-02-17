const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  version: Number,
  data: {
    pastMedical: String,
    familyHistory: String,
    socialHistory: String,
    allergies: [String],
    medications: [String],
  },
  signature: String, // hash for integrity
}, { timestamps: true });

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);