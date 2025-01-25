import { type NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    if (!body.title || !body.description || !body.image) {
      return NextResponse.json(
        { message: "Title, description, and image are required." },
        { status: 400 }
      );
    }

    await connect();

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        image: body.image,
      },
      { new: true } //ensures the updated document is returned
    );

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog updated successfully.", blog: updatedBlog },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in updating blog.", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      console.error("Blog ID is missing in the request parameters.");
      return NextResponse.json(
        { message: "Blog ID is required." },
        { status: 400 }
      );
    }

    await connect();
    console.log(`Attempting to delete blog with id: ${id}`);

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully.", blog: deletedBlog },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
