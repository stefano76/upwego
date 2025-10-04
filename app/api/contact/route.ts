import { getContactLinks } from "@/lib/contact";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contactLinks = getContactLinks();
    return NextResponse.json(contactLinks);
  } catch (error) {
    console.error('Error in API route /api/contact:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
