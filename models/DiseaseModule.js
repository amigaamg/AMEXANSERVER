const mongoose = require('mongoose');

const diseaseModuleSchema = new mongoose.Schema({
  conditionName: { type: String, required: true, unique: true }, // e.g., "Hypertension"
  moduleName: { type: String, required: true }, // component name in frontend
  defaultTargets: {
    systolic: Number,
    diastolic: Number,
    glucose: Number,
    hba1c: Number,
  },
  educationTags: [String],
  alertRules: [{
    type: String,
    threshold: mongoose.Schema.Types.Mixed,
    severity: { type: String, enum: ['low', 'medium', 'high'] },
    message: String,
  }],
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('DiseaseModule', diseaseModuleSchema);