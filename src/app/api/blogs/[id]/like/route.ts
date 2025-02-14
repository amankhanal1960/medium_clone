import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import User from "@/lib/modals/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params;

  // Get the session from the server
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!blogId) {
    return NextResponse.json(
      { message: "Blog ID is required" },
      { status: 400 }
    );
  }

  try {
    await connect();

    // Find the user based on the session email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Retrieve the blog post by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // Toggle like: Check if the blogId is already in the user's likedBlogs array
    const likedIndex = user.likedBlogs.indexOf(blogId);
    let isLiked = false;

    if (likedIndex > -1) {
      // Unlike the blog
      user.likedBlogs.splice(likedIndex, 1);
      blog.likes -= 1;
    } else {
      // Like the blog
      user.likedBlogs.push(blogId);
      blog.likes += 1;
      isLiked = true;
    }

    await user.save();
    await blog.save();

    return NextResponse.json(
      {
        message: isLiked
          ? "Blog liked successfully"
          : "Blog unliked successfully",
        likes: blog.likes,
        isLiked,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error toggling blog like:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
