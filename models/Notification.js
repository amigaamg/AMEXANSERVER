// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title:    { type: String, default: '' },
    message:  { type: String, required: true },
    type: {
      type: String,
      enum: ['alert', 'appointment', 'message', 'payment', 'education', 'general'],
      default: 'general',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    read:     { type: Boolean, default: false, index: true },
    link:     { type: String, default: null }, // optional deep-link in the app
  },
  { timestamps: true }
);

// Composite index for fast patient queries sorted by date
NotificationSchema.index({ patientId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);