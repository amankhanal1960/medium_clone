import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload a file to Supabase storage.
 * @param file   - The file to upload.
 * @param path   - The path where the file will be stored.
 * @param bucket - The bucket where the file will be stored.
 * @returns Uploaded file data.
 */
export const uploadFile = async (
  file: File,
  path: string,
  bucket: "images"
) => {
  try {
    const title = file.name.split(".")[0];
    const fileExt = file.name.split(".")[1];
    const uniqueTitle = `${title}-${Date.now()}`;
    const fileName = `${uniqueTitle}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath).data;

    if (!publicUrl) throw new Error("Failed to retrieve public URL");

    return { path: filePath, publicUrl };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload file. Please try again.");
  }
};
