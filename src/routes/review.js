const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Create a review (patient only, after appointment)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ error: 'Only patients can leave reviews' });
    }
    const { doctorId, appointmentId, rating, comment } = req.body;
    // Optional: check if appointment exists and belongs to patient
    const review = new Review({
      doctorId,
      patientId: req.user._id,
      appointmentId,
      rating,
      comment,
    });
    await review.save();

    // Update doctor's average rating (can be done via aggregation later)
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'You have already reviewed this appointment' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Get reviews for a doctor (public)
router.get('/doctor/:doctorId', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get average rating for a doctor (public)
router.get('/doctor/:doctorId/average', async (req, res) => {
  try {
    const result = await Review.aggregate([
      { $match: { doctorId: mongoose.Types.ObjectId(req.params.doctorId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (result.length === 0) {
      return res.json({ avgRating: 0, count: 0 });
    }
    res.json({ avgRating: result[0].avgRating, count: result[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;