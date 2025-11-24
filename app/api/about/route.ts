import { getAllBlocksData } from "@/lib/content";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blocks = await getAllBlocksData('about');
    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error in API route /api/about:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

