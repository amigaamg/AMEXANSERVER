const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Appointment = require("../../models/Appointment");
const Service = require("../../models/Service");

// -------------------- ROUTES -------------------- //

// CREATE APPOINTMENT
router.post("/create", async (req, res) => {
  try {
    console.log("📝 Create appointment request body:", req.body);
    let { patientId, doctorId, serviceId, date, startTime, durationMinutes, endTime, price } = req.body;

    if (!patientId || !doctorId || !serviceId || !date || !startTime) {
      return res.status(400).json({
        status: "error",
        error: "Missing required fields: patientId, doctorId, serviceId, date, startTime"
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      console.error("Service not found with ID:", serviceId);
      return res.status(404).json({ status: "error", error: "Service not found" });
    }

    // Use provided duration or fallback to service duration or default 30
    if (!durationMinutes) {
      durationMinutes = service.durationMinutes || 30;
      console.log(`Using duration: ${durationMinutes} minutes (from service or default)`);
    }

    price = price || service.price || 1;

    // Calculate endTime if missing
    if (!endTime && startTime && durationMinutes) {
      const [hours, minutes] = startTime.split(":").map(Number);
      const startDate = new Date(`${date}T${startTime}:00`); // better date parsing
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
      endTime = endDate.toTimeString().slice(0, 5); // HH:MM
    }

    const roomId = crypto.randomBytes(16).toString("hex");

    const appointment = new Appointment({
      patientId,
      doctorId,
      serviceId,
      date,
      startTime,
      endTime,
      durationMinutes,
      price,
      roomId,
      status: "pending",
      paymentStatus: "unpaid"
    });

    await appointment.save();
    console.log("✅ Appointment created with ID:", appointment._id);
    res.status(201).json({ status: "success", appointment });
  } catch (err) {
    console.error("❌ Create appointment error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// GET DOCTOR APPOINTMENTS
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate("patientId", "name email")
      .populate("serviceId", "title durationMinutes")
      .sort({ createdAt: -1 });

    res.json({ status: "success", appointments });
  } catch (err) {
    console.error("❌ Fetch doctor appointments error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// GET PATIENT APPOINTMENTS
router.get("/patient/:patientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate("doctorId", "name")
      .populate("serviceId", "title")
      .sort({ createdAt: -1 });

    res.json({ status: "success", appointments });
  } catch (err) {
    console.error("❌ Fetch patient appointments error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// GET SINGLE APPOINTMENT (for consultation)
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name email")
      .populate("doctorId", "name")
      .populate("serviceId", "title");

    if (!appointment) {
      return res.status(404).json({ status: "error", error: "Appointment not found" });
    }

    res.json({ status: "success", appointment });
  } catch (err) {
    console.error("❌ Fetch appointment error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// CONFIRM PAYMENT / PAY APPOINTMENT
router.put("/pay/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ status: "error", error: "Appointment not found" });
    }

    appointment.status = "confirmed";
    appointment.paymentStatus = "paid";
    await appointment.save();

    res.json({ status: "success", message: "Paid and confirmed", appointment });
  } catch (err) {
    console.error("❌ Pay appointment error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// CANCEL APPOINTMENT
router.put("/cancel/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ status: "error", error: "Appointment not found" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ status: "success", message: "Appointment cancelled", appointment });
  } catch (err) {
    console.error("❌ Cancel appointment error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

module.exports = router;