import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import { Types } from "mongoose";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key must be provided.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Find the blog to get the image path
    const blogToDelete = await Blog.findById(id);
    if (!blogToDelete) {
      return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    }

    // Delete the image from Supabase storage
    const { error: deleteImageError } = await supabase.storage
      .from("images") // Replace with your bucket name
      .remove([blogToDelete.image]); // Assuming blogToDelete.image contains the image path

    if (deleteImageError) {
      console.error("Error deleting image from Supabase:", deleteImageError);
      return NextResponse.json(
        { message: "Error deleting image from storage." },
        { status: 500 }
      );
    }

    // Delete the blog
    const deletedBlog = await Blog.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Blog and associated image deleted successfully.",
        blog: deletedBlog,
      },
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
