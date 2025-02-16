import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params;
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

    // Convert blogId to ObjectId
    let blogIdObjectId;
    try {
      blogIdObjectId = new mongoose.Types.ObjectId(blogId);
    } catch (error: unknown) {
      console.error("Error", error);
      return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the blog is already bookmarked using ObjectId comparison
    const isBookmarked = user.bookmarks.some(
      (bookmarkId: mongoose.Types.ObjectId) => bookmarkId.equals(blogIdObjectId)
    );

    if (isBookmarked) {
      // Remove the bookmark
      user.bookmarks = user.bookmarks.filter(
        (bookmarkId: mongoose.Types.ObjectId) =>
          !bookmarkId.equals(blogIdObjectId)
      );
    } else {
      // Add the bookmark
      user.bookmarks.push(blogIdObjectId);
    }

    await user.save();

    return NextResponse.json({
      message: isBookmarked ? "Bookmark removed" : "Bookmark added",
      isBookmarked: !isBookmarked,
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connect();

    const user = await User.findOne({ email: session.user.email }).select(
      "bookmarks"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
