import { Schema, model, models } from "mongoose";

const blogSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString() },
    likes: { type: Number, default: 0 },
    image: { type: String },
    comments: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Blog = models.Blog || model("Blog", blogSchema);

export default Blog;
