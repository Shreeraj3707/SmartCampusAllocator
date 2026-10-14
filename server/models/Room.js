const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    building: { type: String, required: true },
    capacity: { type: Number, required: true },
    equipment: [{ type: String }],
    type: {
      type: String,
      enum: ["classroom", "lab", "seminar"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);