import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("MongoDB connection is already established");
    return;
  }

  if (connectionState === 2) {
    console.log("MongoDB connection is in the process of being established");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI!, {
      dbName: "medium_db",
      bufferCommands: true,
    });
    console.log("MongoDB connection established successfully");
  } catch (error: any) {
    console.error("Failed to connect to MongoDB", error);
  }
};

export default connect;
