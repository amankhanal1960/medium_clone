import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Disable default body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Handle POST method for file uploads
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Define a directory for storing uploaded files
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Configure formidable
    const form = formidable({
      uploadDir, // Set the upload directory here
      keepExtensions: true, // Retain the file's original extension
      multiples: false, // Accept only one file
    });

    // Return a promise because form.parse() is async
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Error parsing the form:", err);
          return res
            .status(500)
            .json({ message: "Error processing the upload." });
        }

        const file = files.image as File | undefined;
        if (!file) {
          return res.status(400).json({ message: "No file uploaded." });
        }

        const fileUrl = `/uploads/${path.basename(file.filepath)}`;
        res.status(200).json({ url: fileUrl });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
}
