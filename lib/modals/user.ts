import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    image: { type: String },
    oauthProvider: { type: String },
    bio: { type: String },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    likedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema);

export default User;
