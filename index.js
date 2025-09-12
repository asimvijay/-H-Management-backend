const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");   // <-- add this

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Enable CORS for frontend
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Import routes
const roomsRoutes = require("./routes/rooms");
const diningRoutes = require("./routes/diningOption");
const testimonialRoutes = require("./routes/testimonials");
const amenityRoutes = require("./routes/amenities");
const galleryRoutes = require("./routes/gallery");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api", roomsRoutes);
app.use("/api/dining-options", diningRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/gallery-images", galleryRoutes);
app.get("/", (req, res) => {
  console.log("✅ Status 200 sent to client");
  res.status(200).send({ status: 200, message: "Fake API working fine!" });
});


// Connect DB + Start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
