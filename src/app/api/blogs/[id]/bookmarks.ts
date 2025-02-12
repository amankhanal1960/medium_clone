// pages/api/bookmarks.ts
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import connect from "@/lib/db";
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

  const { blogId } = req.body;

  if (!blogId) {
    return res.status(400).json({ message: "Blog ID is required" });
  }

  try {
    await connect();

    // Find the user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the blog is already bookmarked
    const isBookmarked = user.bookmarks.includes(blogId);

    if (isBookmarked) {
      // Remove the bookmark
      user.bookmarks = user.bookmarks.filter((id: string) => id !== blogId);
    } else {
      // Add the bookmark
      user.bookmarks.push(blogId);
    }

    await user.save();

    return res.status(200).json({
      message: isBookmarked ? "Bookmark removed" : "Bookmark added",
      isBookmarked: !isBookmarked,
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
