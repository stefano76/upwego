/**
 * API ROUTE: /api/services
 * 
 * This endpoint serves all content blocks for the Services page.
 * It loads content from markdown files using the content management system.
 * 
 * DATA FLOW:
 * 1. Client component (app/services/page.tsx) fetches from this endpoint
 * 2. This route calls getAllBlocksData('services') from lib/content.ts
 * 3. Content is loaded from content/pages/services.md → content/sections/* → content/blocks/*
 * 4. Returns JSON with all sections and blocks for the Services page
 */
import { getAllBlocksData } from "@/lib/content";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Load all content blocks for the 'services' page
    const blocks = await getAllBlocksData('services');
    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error in API route /api/services:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

