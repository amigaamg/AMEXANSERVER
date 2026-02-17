const express = require("express");
const router = express.Router();

// GET /api/patients
// List all patients
router.get("/", async (req, res) => {
  try {
    // TODO: query User model with role "patient"
    res.json({ message: "Patient list", data: [] });
  } catch (err) {
    console.error("Patient list error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/patients/:patientId
// Get a single patient's details
router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    // TODO: look up patient by ID in User model
    res.json({ message: `Details for patient ${patientId}`, data: {} });
  } catch (err) {
    console.error("Patient fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/patients/:patientId
// Update a patient's details
router.put("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const updates = req.body;
    // TODO: update patient in User model
    res.json({ message: `Patient ${patientId} updated`, data: updates });
  } catch (err) {
    console.error("Patient update error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;