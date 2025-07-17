import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MonogoDB Connected Successfully.");
    return connection;
  } catch (error) {
    console.log("MongoDB Connection Error: ",error.message);
  }
};

export default connectDB;
