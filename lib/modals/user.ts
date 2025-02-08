import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    image: { type: String },
    oauthProvider: { type: String },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema);

export default User;
