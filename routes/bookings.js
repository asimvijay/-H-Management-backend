import { connectDB } from "../lib/mongo";
import Booking from "../models/Booking";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const booking = new Booking(req.body);
      await booking.save();
      return res.status(201).json(booking);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "GET") {
    try {
      // If query has id → return single booking
      if (req.query.id) {
        const booking = await Booking.findById(req.query.id).populate("userId", "email phone");
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        return res.json(booking);
      }

      // Else return all bookings
      const bookings = await Booking.find().populate("userId", "email phone");
      return res.json(bookings);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
