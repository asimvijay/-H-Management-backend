const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  hotelId: { type: String, required: true },
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  guests: { adults: Number, children: Number },

  rooms: [
    {
      roomType: String,
      price: Number,
      quantity: Number,
    },
  ],

  totalPrice: { type: Number, required: true },
  status: { type: String, default: "pending" },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
