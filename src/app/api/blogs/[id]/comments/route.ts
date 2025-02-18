import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import Comment from "@/lib/modals/comment";
import User from "@/lib/modals/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Extract blogId from the route parameters
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

    // Parse the request body to extract the comment text
    const { comment } = await request.json();
    if (!comment || typeof comment !== "string") {
      return NextResponse.json(
        { message: "Comment is required" },
        { status: 400 }
      );
    }

    // Create and save the new comment
    const newComment = new Comment({
      blogId,
      userId: user._id,
      comment,
      createdAt: new Date(),
    });
    await newComment.save();

    // Optionally, update the blog's comment count if you're storing it on the blog
    blog.comments += 1;
    await blog.save();

    return NextResponse.json(
      { message: "Comment added successfully", comment: newComment },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params;

  try {
    await connect();

    // Find comments for this blog, sorted by createdAt descending.
    const comments = await Comment.find({ blogId })
      .sort({ createdAt: -1 })
      .populate("userId", "name image"); // Populate user details

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Correct params structure
) {
  const { id: blogId } = await params;

  // Get commentId from query parameters
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("commentId");

  if (!commentId) {
    return NextResponse.json(
      { message: "Comment ID is required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connect();

    // Optional: Verify user's permission to delete the comment
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find and delete the comment, ensuring it belongs to the user
    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      blogId,
      userId: user._id, // Ensure the comment belongs to the requesting user
    });

    if (!deletedComment) {
      return NextResponse.json(
        { message: "Comment not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the blog's comment count
    await Blog.findByIdAndUpdate(blogId, { $inc: { comments: -1 } });

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
