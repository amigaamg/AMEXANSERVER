const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  universalId: { type: String, unique: true }, // generated on registration
  email: { type: String, required: true, unique: true },
  name: String,
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  phone: String,
  photoURL: String,
  // Patient fields
  emergencyContact: String,
  bloodGroup: String,
  allergies: [String],
  conditions: [String], // ICD-10 codes
  medications: [{
    name: String,
    dose: String,
    startedAt: Date,
    endedAt: Date,
  }],
  carePrograms: [String],
  // Doctor fields
  clinics: [{
    id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: String,
    description: String,
    duration: Number, // minutes
    price: Number,
    isFirstVisitOnly: Boolean,
    requiresReferral: Boolean,
  }],
  facilityId: String, // if doctor belongs to facility
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);