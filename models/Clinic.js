const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
  duration: Number,
  price: Number,
  isFirstVisitOnly: Boolean,
  requiresReferral: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('Clinic', clinicSchema);