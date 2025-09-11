import { connectDB } from "../lib/mongo";  // <- your DB helper
import Amenity from "../models/Amenity";

export default async function handler(req, res) {
  await connectDB();

  try {
    if (req.method === "GET") {
      // Get all amenities
      const amenities = await Amenity.find();
      return res.status(200).json(amenities);
    }

    if (req.method === "POST") {
      // Create a new amenity
      const amenity = new Amenity(req.body);
      await amenity.save();
      return res.status(201).json(amenity);
    }

    // If method not supported
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
