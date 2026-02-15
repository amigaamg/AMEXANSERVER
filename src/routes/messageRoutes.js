const express = require("express");
const router = express.Router();
const Message = require("../../models/Message");

// Save a message
router.post("/", async (req, res) => {
  try {
    const { appointmentId, senderId, text } = req.body;
    if (!appointmentId || !senderId || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const message = await Message.create({ appointmentId, senderId, text });
    res.status(201).json(message);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get messages for an appointment
router.get("/:appointmentId", async (req, res) => {
  try {
    const messages = await Message.find({ appointmentId: req.params.appointmentId })
      .populate("senderId", "name")
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;