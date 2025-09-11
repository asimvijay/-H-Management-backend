const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema(
  {
    icon: String,
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Amenity", amenitySchema);
