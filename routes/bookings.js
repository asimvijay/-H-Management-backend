const express = require("express");
const Booking = require("../models/booking");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    req.user = null; // No token, treat as guest
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token data to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Create booking
router.post("/book", authenticateToken, async (req, res) => {
  try {
    const {
      hotelId,
      checkin,
      checkout,
      guests,
      rooms,
      totalPrice,
      guestInfo,
    } = req.body;

    // Validate required fields
    if (!hotelId || !checkin || !checkout || !guests || !rooms || !totalPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let userId = req.user ? req.user.id : null;

    // For guest users (no token or invalid token), create a new user in the User collection
    if (!req.user) {
      if (!guestInfo || !guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
        return res.status(400).json({ error: "Guest information is required for non-logged-in users" });
      }

      // Check if user already exists
      let user = await User.findOne({ email: guestInfo.email });
      if (!user) {
        // Create new guest user
        const hashedPassword = await bcrypt.hash("pubmaster", 10);
        user = new User({
          email: guestInfo.email,
          password: hashedPassword,
          phone: guestInfo.phone,
          name: `${guestInfo.firstName} ${guestInfo.lastName}`,
          status: "reserved",
          checkIn: new Date(checkin),
          checkOut: new Date(checkout),
          room: rooms[0]?.roomnumber,
        });
        await user.save();
      }
      userId = user._id;
    }

    const bookingData = {
      userId,
      guestInfo: req.user ? undefined : guestInfo,
      hotelId,
      checkin,
      checkout,
      guests,
      rooms,
      totalPrice,
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Populate userId if present
    const populatedBooking = await Booking.findById(booking._id).populate("userId", "email phone name");
    res.status(201).json(populatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings for the logged-in user or guest (by email)
router.get("/", authenticateToken, async (req, res) => {
  try {
    let bookings;
    if (req.user) {
      // Fetch bookings for logged-in user
      bookings = await Booking.find({ userId: req.user.id }).populate("userId", "email phone name");
    } else {
      // For guest users, require email query parameter
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: "Email is required for guest bookings" });
      }
      bookings = await Booking.find({ "guestInfo.email": email }).populate("userId", "email phone name");
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId", "email phone name");
    // Transform bookings to include a consistent 'name' field
    const formattedBookings = bookings.map((booking) => {
      const name = booking.userId?.name || 
                   (booking.guestInfo ? `${booking.guestInfo.firstName || ''} ${booking.guestInfo.lastName || ''}`.trim() : 'Unknown Guest');
                   return {
        ...booking._doc, // Spread the booking document
        name, // Add computed name field
      };
    });
    res.json(formattedBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get booking by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("userId", "email phone name");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Restrict access: Only allow the user who created the booking or guests with matching email
    if (req.user && booking.userId && booking.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access to this booking" });
    }
    if (!req.user && booking.guestInfo && booking.guestInfo.email !== req.query.email) {
      return res.status(403).json({ message: "Unauthorized access to this booking" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;