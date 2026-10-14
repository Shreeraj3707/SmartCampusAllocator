const router = require("express").Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// All routes here require admin
router.use(requireAuth, requireAdmin);

// GET all bookings (all users, all statuses)
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("room")
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH booking status
router.patch("/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET stats for admin dashboard
router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, totalBookings, pending, approved, rejected] =
      await Promise.all([
        User.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ status: "pending" }),
        Booking.countDocuments({ status: "approved" }),
        Booking.countDocuments({ status: "rejected" }),
      ]);
    res.json({
      success: true,
      stats: { totalUsers, totalBookings, pending, approved, rejected },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;