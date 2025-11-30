/**
 * API ROUTE: /api/about
 * 
 * This endpoint serves all content blocks for the About page.
 * It loads content from markdown files using the content management system.
 * 
 * DATA FLOW:
 * 1. Client component (app/about/page.tsx) fetches from this endpoint
 * 2. This route calls getAllBlocksData('about') from lib/content.ts
 * 3. Content is loaded from content/pages/about.md → content/sections/* → content/blocks/*
 * 4. Returns JSON with all sections and blocks for the About page
 * 
 * RESPONSE FORMAT:
 * {
 *   "about-intro": { title: "...", blocks: { ... } },
 *   "about-owners": { title: "...", blocks: { ... } },
 *   ...
 * }
 */
import { getAllBlocksData } from "@/lib/content";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Load all content blocks for the 'about' page
    // This reads from content/pages/about.md and loads all related sections/blocks
    const blocks = await getAllBlocksData('about');
    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error in API route /api/about:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

