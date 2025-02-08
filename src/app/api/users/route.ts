import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db"; // MongoDB connection utility
import User from "@/lib/modals/user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, image, bio } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    await connect(); // Connect to MongoDB

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 400 }
      );
    }

    // Create a new user (password will be hashed in user.ts)
    const newUser = new User({ name, email, password, image, bio });
    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully.", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in saving user.", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connect(); // Ensure DB connection

    // Get the query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    let user;
    if (email) {
      user = await User.findOne({ email }).select("-password"); // Exclude password from response
    } else if (id) {
      user = await User.findById(id).select("-password");
    } else {
      return NextResponse.json(
        {
          message:
            "Please provide either an email or an id to search for a user.",
        },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User retrieved successfully.", user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in retrieving user.", error: error.message },
      { status: 500 }
    );
  }
}
