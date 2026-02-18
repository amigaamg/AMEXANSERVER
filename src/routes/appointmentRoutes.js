const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Appointment = require("../../models/Appointment");
const Service = require("../../models/Service");

// CREATE APPOINTMENT
router.post("/create", async (req, res) => {
  try {
    console.log("📝 Create appointment request body:", req.body);
    let { patientId, doctorId, serviceId, date, startTime, durationMinutes, endTime, price } = req.body;

    if (!patientId || !doctorId || !date || !startTime) {
      return res.status(400).json({
        status: "error",
        error: "Missing required fields: patientId, doctorId, date, startTime"
      });
    }

    // serviceId is optional — only look up service if provided
    let service = null;
    if (serviceId) {
      service = await Service.findById(serviceId);
      if (!service) {
        console.warn("Service not found with ID:", serviceId, "— continuing without it");
      }
    }

    if (!durationMinutes) {
      durationMinutes = service?.durationMinutes || 30;
    }

    price = price || service?.price || 1;

    if (!endTime && startTime && durationMinutes) {
      const startDate = new Date(`${date}T${startTime}:00`);
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
      endTime = endDate.toTimeString().slice(0, 5);
    }

    const roomId = crypto.randomBytes(16).toString("hex");

    const appointment = new Appointment({
      patientId,
      doctorId,
      ...(serviceId && { serviceId }),
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
      .populate({ path: "serviceId", select: "title durationMinutes", strictPopulate: false })
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
      .populate({ path: "serviceId", select: "title", strictPopulate: false })
      .sort({ createdAt: -1 });

    res.json({ status: "success", appointments });
  } catch (err) {
    console.error("❌ Fetch patient appointments error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// GET SINGLE APPOINTMENT
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name email")
      .populate("doctorId", "name")
      .populate({ path: "serviceId", select: "title", strictPopulate: false });

    if (!appointment) {
      return res.status(404).json({ status: "error", error: "Appointment not found" });
    }

    res.json({ status: "success", appointment });
  } catch (err) {
    console.error("❌ Fetch appointment error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// PAY APPOINTMENT
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