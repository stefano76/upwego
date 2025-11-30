/**
 * API ROUTE: /api/home
 * 
 * This endpoint serves all content blocks for the Home page.
 * It loads content from markdown files using the content management system.
 * 
 * DATA FLOW:
 * 1. Client component (app/page.tsx) fetches from this endpoint
 * 2. This route calls getAllBlocksData('home') from lib/content.ts
 * 3. Content is loaded from content/pages/home.md → content/sections/* → content/blocks/*
 * 4. Returns JSON with all sections and blocks for the Home page
 * 
 * RESPONSE FORMAT:
 * {
 *   "home-intro": { title: "...", blocks: { ... } },
 *   "home-about": { title: "...", blocks: { ... } },
 *   "home-challenge": { title: "...", blocks: { ... } },
 *   ...
 * }
 */
import { getAllBlocksData } from "@/lib/content";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Load all content blocks for the 'home' page
    // This reads from content/pages/home.md and loads all related sections/blocks
    const blocks = await getAllBlocksData('home');
    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error in API route /api/home:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
