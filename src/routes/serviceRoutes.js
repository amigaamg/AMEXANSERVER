const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Prevent model overwrite crash
const Service =
  mongoose.models.Service ||
  mongoose.model(
    "Service",
    new mongoose.Schema(
      {
        doctorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        title: { type: String, required: true },
        description: String,
        durationMinutes: Number,
        price: { type: Number, default: 1 },
        isActive: { type: Boolean, default: true },
      },
      { timestamps: true }
    )
  );

// CREATE SERVICE
router.post("/create", async (req, res) => {
  try {
    console.log("CREATE HIT with body:", req.body);
    const { doctorId, title, description, durationMinutes, price } = req.body;

    if (!doctorId || !title) {
      return res.status(400).json({ error: "Missing required fields: doctorId, title" });
    }

    const service = await Service.create({
      doctorId,
      title,
      description,
      durationMinutes,
      price: price || 1,
      isActive: true,
    });

    console.log("✅ Service created:", service._id);
    res.status(201).json(service);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET ALL active services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate("doctorId", "name");
    res.json(services);
  } catch (err) {
    console.error("GET services error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET DOCTOR SERVICES
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const services = await Service.find({ doctorId: req.params.doctorId });
    res.json(services);
  } catch (err) {
    console.error("GET doctor services error:", err);
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE
router.put("/toggle/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    service.isActive = !service.isActive;
    await service.save();
    res.json(service);
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;