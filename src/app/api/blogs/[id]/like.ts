import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import User from "@/lib/modals/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id: blogId } = req.query;

  if (!blogId) {
    return res.status(400).json({ message: "Blog ID is required" });
  }

  try {
    await connect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const likedIndex = user.likedBlogs.indexOf(blogId);
    let isLiked = false;

    if (likedIndex > -1) {
      // User has already liked the blog, so unlike it
      user.likedBlogs.splice(likedIndex, 1);
      blog.likes -= 1;
    } else {
      // User hasn't liked the blog, so like it
      user.likedBlogs.push(blogId);
      blog.likes += 1;
      isLiked = true;
    }

    await user.save();
    await blog.save();

    return res.status(200).json({
      message: isLiked
        ? "Blog liked successfully"
        : "Blog unliked successfully",
      likes: blog.likes,
      isLiked,
    });
  } catch (error) {
    console.error("Error toggling blog like:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
