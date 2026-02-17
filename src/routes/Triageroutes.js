const express = require("express");
const router = express.Router();

// POST /api/triage
// Submit a triage assessment for a patient
router.post("/", async (req, res) => {
  try {
    const { patientId, symptoms, severity } = req.body;
    if (!patientId || !symptoms) {
      return res.status(400).json({ error: "patientId and symptoms are required" });
    }
    // TODO: add Triage model and save to DB
    res.json({
      message: "Triage submitted successfully",
      data: { patientId, symptoms, severity: severity || "unknown" },
    });
  } catch (err) {
    console.error("Triage error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/triage/:patientId
// Get triage history for a patient
router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    // TODO: query Triage model from DB
    res.json({ message: `Triage records for patient ${patientId}`, data: [] });
  } catch (err) {
    console.error("Triage fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;