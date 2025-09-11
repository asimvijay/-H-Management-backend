import { connectDB } from "../lib/mongo";
import Testimonial from "../models/Testimonial";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const testimonials = await Testimonial.find();
      return res.json(testimonials);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const testimonial = new Testimonial(req.body);
      await testimonial.save();
      return res.status(201).json(testimonial);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
