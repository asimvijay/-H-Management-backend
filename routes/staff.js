const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Staff = require("../models/staff");

const router = express.Router();

// Middleware: JWT Auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Authentication token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};



// Create staff
router.post("/", async (req, res) => {
  try {
    const { name, position, department, email, phone, status, shifts, hireDate, salary } = req.body;
    const hashedPassword = await bcrypt.hash("pubgmaster", 10); // Default password
    const staff = new Staff({ name, position, department, email, phone, status, shifts, hireDate, salary, password: hashedPassword });
    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all staff
router.get("/all", async (req, res) => {
  try {
    const staff = await Staff.find().select("-password");
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update staff
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete staff
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
