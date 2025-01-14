import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

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
    await mongoose.connect(MONGODB_URI, {
      dbName: "medium_db",
    });

    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

export default connect;
