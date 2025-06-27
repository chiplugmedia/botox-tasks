import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://chiplugtv:s6TvH5FG0HBL2XAx@cluster0.dlpvj9o.mongodb.net"
    )
    .then(() => console.log("MongoDB connected"));
};
