const mongoose = require("mongoose");

const diningOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    description: { type: String, required: true },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiningOption", diningOptionSchema);
