import { getTagline } from "@/lib/tagline";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tagline = getTagline();
    return NextResponse.json({ tagline });
  } catch (error) {
    console.error('Error in API route /api/tagline:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
