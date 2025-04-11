import mongoose from "mongoose";

export const connectDB = async (db) => {
  return await mongoose.connect(db);
};
