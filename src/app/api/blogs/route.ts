import { NextResponse } from "next/server";
import blog from "../../../../lib/modals/blog";
import connect from "../../../../lib/db";
export const GET = async () => {
  try {
    await connect();
    const Blog = await blog.find();
    return new NextResponse(JSON.stringify(Blog), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse("Error fetching data" + error.message, {
      status: 500,
    });
  }
};
