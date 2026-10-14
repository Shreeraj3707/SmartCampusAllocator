const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/users", require("./routes/users"));
app.use("/api/admin", require("./routes/admin"));

// Root / health check
app.get("/", (req, res) => {
  res.send("Smart Campus Allocator Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is working correctly" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});