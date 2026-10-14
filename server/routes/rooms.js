const router = require("express").Router();
const Room = require("../models/Room");

// GET all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create a room (admin-only later)
router.post("/", async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, room });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;