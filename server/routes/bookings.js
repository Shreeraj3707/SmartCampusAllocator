const router = require("express").Router();
const Booking = require("../models/Booking");
const { hasTimeConflict } = require("../utils/conflict");

// POST create a booking
router.post("/", async (req, res) => {
  try {
    const { room, user, date, startTime, endTime, purpose } = req.body;

    if (!room || !user || !date || !startTime || !endTime || !purpose) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid time range" });
    }

    const existing = await Booking.find({
      room,
      date,
      status: { $in: ["pending", "approved"] },
    });

    const conflict = existing.some((b) =>
      hasTimeConflict(b, { startTime, endTime })
    );

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "Time slot already booked for this room",
      });
    }

    const booking = await Booking.create({
      room,
      user,
      date,
      startTime,
      endTime,
      purpose,
      status: "pending",
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET bookings for a specific user
router.get("/my/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate(
      "room"
    );
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update booking status (admin action)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected", "cancelled"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;