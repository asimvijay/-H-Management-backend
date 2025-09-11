// index.js (rename later to lib/mongo.js for clarity)
const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}

module.exports = { connectDB };
