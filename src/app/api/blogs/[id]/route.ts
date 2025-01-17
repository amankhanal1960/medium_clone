import { NextResponse } from "next/server"; //used to send structured HTTP request in Next.js API routes
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
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
};
