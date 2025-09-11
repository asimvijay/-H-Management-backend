require("dotenv").config();
const mongoose = require("mongoose");

const rooms = require("./data/rooms");
const roomTypes = require("./data/roomType");
const diningOptions = require("./data/DiningOption");
const testimonials = require("./data/Testimonial");
const amenities = require("./data/Amenities");
const galleryImages = require("./data/Gallery");

// Import models
const Room = require("./models/roomModel");
const RoomType = require("./models/roomType");
const DiningOption = require("./models/DiningOption");
const Testimonial = require("./models/Testimonial");
const Amenity = require("./models/Amenity");
const GalleryImage = require("./models/Gallery");

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Clear old data
    await Promise.all([
      Room.deleteMany(),
      RoomType.deleteMany(),
      DiningOption.deleteMany(),
      Testimonial.deleteMany(),
      Amenity.deleteMany(),
      GalleryImage.deleteMany(),
    ]);

    console.log("🗑️ Old data removed");

    // Insert new data
    await Room.insertMany(rooms);
    await RoomType.insertMany(roomTypes);
    await DiningOption.insertMany(diningOptions);
    await Testimonial.insertMany(testimonials);
    await Amenity.insertMany(amenities);
    await GalleryImage.insertMany(galleryImages.map((url) => ({ url })));

    console.log("🌱 Data seeded successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    process.exit(1);
  }
}

seedData();
