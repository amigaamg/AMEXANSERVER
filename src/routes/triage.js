const express = require('express');
const router = express.Router();

// Simple rule-based triage (can be expanded)
router.post('/', (req, res) => {
  const { answers } = req.body;
  let recommendation = 'general';
  let message = 'General check-up recommended.';

  if (answers.symptoms?.includes('chest_pain')) {
    recommendation = 'emergency';
    message = 'Please go to the nearest emergency room immediately.';
  } else if (answers.symptoms?.some(s => ['headache', 'dizziness', 'blurred_vision'].includes(s))) {
    if (answers.q2_risk === 'yes') {
      if (answers.q3_meds === 'no') {
        recommendation = 'hypertension_first_visit';
        message = 'You may have undiagnosed hypertension. Book a first visit.';
      } else {
        recommendation = 'hypertension_followup';
        message = 'Follow up with your hypertension doctor.';
      }
    } else {
      recommendation = 'hypertension_evaluation';
      message = 'Your symptoms suggest a blood pressure check.';
    }
  }
  res.json({ recommendation, message });
});

module.exports = router;