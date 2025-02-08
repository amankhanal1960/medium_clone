import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";

// Define user schema
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: false,
    },
    image: { type: String },
    oauthProvider: { type: String },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (!this.password || this.password.trim() === "") {
    return next(new Error("Password is required")); // Handle if password is not provided
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt for password hashing
    if (typeof this.password === "string") {
      this.password = await bcrypt.hash(this.password, salt); // Hash password
    }
    next();
  } catch (error) {
    console.error("Error during password hashing:", error);
    next(error as Error);
  }
});

// Model creation
const User = models.User || model("User", userSchema);

export default User;
