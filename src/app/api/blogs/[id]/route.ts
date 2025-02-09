import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import { Types } from "mongoose";

interface BlogRequestBody {
  title: string;
  description: string;
  image: string;
}

// Update a blog post by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Validate the blog ID
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid blog ID." },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = (await request.json()) as BlogRequestBody;

    // Validate required fields
    if (!body.title || !body.description || !body.image) {
      return NextResponse.json(
        { message: "Title, description, and image are required." },
        { status: 400 }
      );
    }

    // Connect to the database
    await connect();

    // Check if the blog exists
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    }

    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        image: body.image,
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Blog updated successfully.", blog: updatedBlog },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      {
        message: "Error in updating blog.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Delete a blog post by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Validate the blog ID
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid blog ID." },
        { status: 400 }
      );
    }

    // Connect to the database
    await connect();

    // Delete the blog
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully.", blog: deletedBlog },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
