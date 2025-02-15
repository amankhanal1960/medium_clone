// app/api/redirect/route.ts
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Get the 'url' query parameter
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  // Validate the URL
  const allowedDomains = ["medium-clone-three-nu.vercel.app"];
  const isValidUrl =
    url && allowedDomains.some((domain) => url.includes(domain));

  if (isValidUrl) {
    // Redirect to the provided URL
    return NextResponse.redirect(url);
  } else {
    // Fallback to the homepage if no URL is provided or it's invalid
    return NextResponse.redirect("https://medium-clone-three-nu.vercel.app/");
  }
}
