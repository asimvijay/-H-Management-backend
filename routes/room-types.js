import { connectDB } from "../lib/mongo";
import RoomType from "../models/roomType";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const roomTypes = await RoomType.find();
      return res.json(roomTypes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const roomType = new RoomType(req.body);
      await roomType.save();
      return res.status(201).json(roomType);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const updated = await RoomType.findByIdAndUpdate(req.query.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) return res.status(404).json({ error: "RoomType not found" });
      return res.json(updated);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await RoomType.findByIdAndDelete(req.query.id);
      if (!deleted) return res.status(404).json({ error: "RoomType not found" });
      return res.json({ message: "RoomType deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
