// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth'); // your existing JWT middleware

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/patients/:id/notifications
// Returns the 50 most recent notifications for a patient
// ─────────────────────────────────────────────────────────────────────────────
router.get('/patients/:id/notifications', auth, async (req, res) => {
  try {
    // Only the patient themselves (or a doctor/admin) can read their notifications
    if (
      req.user._id.toString() !== req.params.id &&
      req.user.role !== 'doctor' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const notifications = await Notification.find({ patientId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(notifications);
  } catch (err) {
    console.error('GET notifications error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/patients/:id/notifications
// Doctor or system creates a notification for a patient
// ─────────────────────────────────────────────────────────────────────────────
router.post('/patients/:id/notifications', auth, async (req, res) => {
  try {
    const { title, message, type, severity, link } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const notification = await Notification.create({
      patientId: req.params.id,
      doctorId:  req.user.role === 'doctor' ? req.user._id : null,
      title:     title ?? '',
      message,
      type:      type ?? 'general',
      severity:  severity ?? 'low',
      link:      link ?? null,
    });

    // Emit via socket so the patient's dashboard updates in real time
    const io = req.app.get('io');
    if (io) {
      io.to(`patient:${req.params.id}`).emit('notification', notification);
    }

    res.status(201).json(notification);
  } catch (err) {
    console.error('POST notification error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/notifications/read-all
// Mark all unread notifications as read for the logged-in patient
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  This MUST come BEFORE /:id/read so Express doesn't treat "read-all" as an id
router.put('/notifications/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { patientId: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Read-all notifications error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/notifications/:id/read
// Mark a single notification as read
// ─────────────────────────────────────────────────────────────────────────────
router.put('/notifications/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Only the owning patient can mark it read
    if (notification.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    notification.read = true;
    await notification.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Mark notification read error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/notifications/:id
// Delete a single notification
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/notifications/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    if (notification.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await notification.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error('Delete notification error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;