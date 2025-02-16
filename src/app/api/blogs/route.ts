import { NextResponse } from "next/server";
import connect from "../../../../lib/db";
import Blog from "../../../../lib/modals/blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import mongoose from "mongoose";
import User from "@/lib/modals/user";

// Fetch all blog posts

export async function GET() {
  try {
    await connect();

    // Fetch all blogs with the author info populated
    const blogs = await Blog.find().populate("author", "_id name image");

    // Attempt to get the current session (if available)
    const session = await getServerSession(authOptions);

    // If a user is logged in, fetch their bookmarks and likedBlogs from DB.
    let userBookmarks: string[] = [];
    let userLikedBlogs: string[] = [];
    if (session) {
      const user = await User.findOne({ email: session.user.email }).select(
        "bookmarks likedBlogs"
      );
      if (user) {
        userBookmarks = user.bookmarks.map((id: mongoose.Types.ObjectId) =>
          id.toString()
        );
        userLikedBlogs = user.likedBlogs.map((id: mongoose.Types.ObjectId) =>
          id.toString()
        );
      }
    }

    // Map over the blogs to add isBookmarked and isLiked fields based on user data.
    const formattedBlogs = blogs.map((blog) => {
      const blogId = blog._id.toString();
      return {
        ...blog.toObject(),
        id: blogId,
        // If the user is not logged in, these will be false.
        isBookmarked: userBookmarks.includes(blogId),
        isLiked: userLikedBlogs.includes(blogId),
      };
    });

    return NextResponse.json({ blogs: formattedBlogs }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error fetching the data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    if (!body.title || !body.description || !body.image) {
      return NextResponse.json(
        { message: "Title and description and image are required." },
        { status: 400 }
      );
    }

    await connect();

    const newBlog = new Blog(body);
    await newBlog.save();

    return NextResponse.json(
      { message: "Blog is Created", blog: newBlog },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Error in creating Blog ",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
