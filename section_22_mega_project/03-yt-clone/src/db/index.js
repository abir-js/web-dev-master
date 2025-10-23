import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongoDB ✅");
  } catch (error) {
    console.log("Error connecting to DB ❌", error);
    process.exit(1);
  }
};
