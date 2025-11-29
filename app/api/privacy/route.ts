import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'pages', 'privacy.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return NextResponse.json({
      title: data.title || 'Privacy Policy',
      content: content.trim()
    });
  } catch (error) {
    console.error('Error in API route /api/privacy:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
