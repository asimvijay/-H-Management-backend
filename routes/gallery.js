import { connectDB } from "../lib/mongo";
import GalleryImage from "../models/Gallery";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const images = await GalleryImage.find();
      return res.json(images);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const doc = new GalleryImage(req.body);
      await doc.save();
      return res.status(201).json(doc);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
