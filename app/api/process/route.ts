/**
 * API ROUTE: /api/process
 * 
 * This endpoint serves all content blocks for the Process page.
 * It loads content from markdown files using the content management system.
 * 
 * DATA FLOW:
 * 1. Client component (app/process/page.tsx) fetches from this endpoint
 * 2. This route calls getAllBlocksData('process') from lib/content.ts
 * 3. Content is loaded from content/pages/process.md → content/sections/* → content/blocks/*
 * 4. Returns JSON with all sections and blocks for the Process page
 */
import { getAllBlocksData } from "@/lib/content";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Load all content blocks for the 'process' page
    const blocks = await getAllBlocksData('process');
    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error in API route /api/process:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

