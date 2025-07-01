import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect("mongodb+srv://chiplugtv:1234567890@cluster0.dlpvj9o.mongodb.net/botox")
    .then(() => console.log("MongoDB connected"));
};
