import { getAllBlocksData } from "@/lib/home";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blocks = await getAllBlocksData();
    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error in API route /api/home:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
