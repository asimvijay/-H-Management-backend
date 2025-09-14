// models/booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Optional for guest users
  guestInfo: {
    title: { type: String, required: function () { return !this.userId; } }, // Required for guest users
    firstName: { type: String, required: function () { return !this.userId; } },
    lastName: { type: String, required: function () { return !this.userId; } },
    email: { type: String, required: function () { return !this.userId; } },
    phone: { type: String, required: function () { return !this.userId; } },
    country: { type: String },
    address: { type: String },
    city: { type: String },
    zipCode: { type: String },
    specialRequests: { type: String },
    purposeOfStay: { type: String, enum: ["leisure", "business", "celebration", "other"], default: "leisure" },
    identificationType: { type: String, enum: ["passport", "driver-license", "id-card"] },
    identificationNumber: { type: String },
  },
  hotelId: { type: String, required: true },
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  guests: {
    adults: { type: Number, required: true },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 },
  },
  rooms: [
    {
      roomId: { type: String, required: true },
      roomType: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);