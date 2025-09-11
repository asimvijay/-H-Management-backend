import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../lib/mongo";   // helper for Mongo connection
import User from "../models/user";

export default async function handler(req, res) {
  await connectDB();

  try {
    // REGISTER
    if (req.method === "POST" && req.url.endsWith("/register")) {
      const { email, password, phone, name } = req.body;

      if (!email || !password || !phone) {
        return res.status(400).json({ message: "Email, password & phone required" });
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword, phone, name });
      await user.save();

      return res.status(201).json({ message: "User registered successfully" });
    }

    // LOGIN
    if (req.method === "POST" && req.url.endsWith("/login")) {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      return res.status(200).json({
        token,
        user: { id: user._id, email: user.email, phone: user.phone },
      });
    }

    // METHOD NOT ALLOWED
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
