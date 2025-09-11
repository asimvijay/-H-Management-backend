const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    id_no: { type: Number, required: true, unique: true }, // Room ID
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType", // must match model name in roomType.js
    },
    status: { type: String, default: "available" },
    price: { type: String, required: true },
    capacity: { type: Number, required: true },
    amenities: [String],
    floor: Number,
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
