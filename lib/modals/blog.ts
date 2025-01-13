import { Schema, model, models } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    image: { type: "string" },
  },
  {
    timestamps: true,
  }
);

const blog = models.User || model("User", blogSchema);

export default blog;
