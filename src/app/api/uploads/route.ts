import { type NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    const { publicUrl } = await uploadFile(file, "blogImages", "images");

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Error in upload handler:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
