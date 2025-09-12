
require("dotenv").config();
const mongoose = require("mongoose");

const roomsData = require("./data/rooms");
const roomTypesData = require("./data/roomType");
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

    // Insert RoomType data first
    const insertedRoomTypes = await RoomType.insertMany(roomTypesData);
    console.log(`🌱 Inserted ${insertedRoomTypes.length} room types`);

    // Create a map of RoomType names to their ObjectIds
    const roomTypeMap = new Map(
      insertedRoomTypes.map((rt) => [rt.name, rt._id])
    );

    // Transform roomsData to match Room schema
    const transformedRooms = roomsData.map((room) => {
      const roomTypeId = roomTypeMap.get(room.type);
      if (!roomTypeId) {
        throw new Error(`RoomType "${room.type}" not found for room ID ${room.id_no}`);
      }
      return {
        id_no: room.id_no,
        roomType: roomTypeId,
        status: room.status,
        price: room.price, // Already a string, matches schema
        capacity: room.capacity,
        amenities: room.amenities,
        floor: room.floor,
        images: room.images,
      };
    });

    // Insert transformed Room data
    await Room.insertMany(transformedRooms);
    console.log(`🌱 Inserted ${transformedRooms.length} rooms`);

    // Insert other data
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
