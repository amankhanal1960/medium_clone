import { Schema, model, models } from "mongoose";

const commentSchema = new Schema(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;
