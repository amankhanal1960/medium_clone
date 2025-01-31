import { NextResponse } from "next/server";
import connect from "../../../../lib/db";
import Blog from "../../../../lib/modals/blog";

// Fetch all blog posts
export async function GET() {
  try {
    await connect();

    const blogs = await Blog.find({});

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { message: "Error fetching the data ", error: error.message },
      {
        status: 500,
      }
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
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { message: "Error in creating Blog ", error: error.message },
      { status: 500 }
    );
  }
};
