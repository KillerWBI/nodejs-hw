// src/db/connectMongoDB.js
import mongoose from "mongoose";
import noteSchema from "../models/note.js";
export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
    await noteSchema.syncIndexes();
    console.log("✅ MongoDB connection established successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1); // аварійне завершення програми
  }
};
