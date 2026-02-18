require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// -----------------------------
// MongoDB Connection
// -----------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// -----------------------------
// User Schema & Model (safe - won't conflict with doctorRoutes)
// -----------------------------
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["doctor", "patient"], default: "patient" },
  },
  { timestamps: true }
);

// ✅ Safe pattern - reuse existing model if already registered
const User = mongoose.models.User || mongoose.model("User", userSchema);

// -----------------------------
// Import Route Handlers
// -----------------------------
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const serviceRoutes = require("./src/routes/serviceRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const triageRoutes = require("./src/routes/Triageroutes");
const patientRoutes = require("./src/routes/patientRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");

// -----------------------------
// Authentication Routes
// -----------------------------
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    const userObj = user.toObject();
    delete userObj.password;
    res.json({ message: "Registered successfully", user: userObj });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userObj = user.toObject();
    delete userObj.password;
    res.json({ token, user: userObj });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Health Check
// -----------------------------
app.get("/", (req, res) => {
  res.send("AMEXAN backend running ✅");
});

// -----------------------------
// Mount Routes
// -----------------------------
app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/triage", triageRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);

// -----------------------------
// Socket.IO
// -----------------------------
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on("join_room", (room) => socket.join(room));
  socket.on("offer", ({ room, offer }) => socket.to(room).emit("offer", offer));
  socket.on("answer", ({ room, answer }) => socket.to(room).emit("answer", answer));
  socket.on("ice_candidate", ({ room, candidate }) => socket.to(room).emit("ice_candidate", candidate));
  socket.on("send_message", ({ room, message }) => socket.to(room).emit("receive_message", { message }));
  socket.on("disconnect", () => console.log(`❌ Client disconnected: ${socket.id}`));
});

// -----------------------------
// Start Server
// -----------------------------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});