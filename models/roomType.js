const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [String],
    amenities: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomType", roomTypeSchema);
