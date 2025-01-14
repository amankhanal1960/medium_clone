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
