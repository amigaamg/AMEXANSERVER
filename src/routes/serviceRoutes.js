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
        description: { type: String, default: "" },
        durationMinutes: { type: Number, default: 30 },
        price: { type: Number, default: 1 },
        isActive: { type: Boolean, default: true },
      },
      { timestamps: true }
    )
  );

// -------------------- ROUTES -------------------- //

// CREATE SERVICE
router.post("/create", async (req, res) => {
  try {
    const { doctorId, title, description, durationMinutes, price } = req.body;

    if (!doctorId || !title) {
      return res
        .status(400)
        .json({ error: "Missing required fields: doctorId, title" });
    }

    const service = await Service.create({
      doctorId,
      title,
      description: description || "",
      durationMinutes: durationMinutes || 30,
      price: price || 1,
      isActive: true,
    });

    res.status(201).json({ status: "success", service });
  } catch (err) {
    console.error("CREATE SERVICE ERROR:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET ALL ACTIVE SERVICES
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).populate(
      "doctorId",
      "name"
    );
    res.json({ status: "success", services });
  } catch (err) {
    console.error("GET ALL SERVICES ERROR:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET ALL SERVICES FOR A DOCTOR
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const services = await Service.find({ doctorId: req.params.doctorId });
    res.json({ status: "success", services });
  } catch (err) {
    console.error("GET DOCTOR SERVICES ERROR:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// TOGGLE SERVICE ACTIVE/INACTIVE
router.put("/toggle/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ status: "error", error: "Service not found" });

    service.isActive = !service.isActive;
    await service.save();

    res.json({ status: "success", service });
  } catch (err) {
    console.error("TOGGLE SERVICE ERROR:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
