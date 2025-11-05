import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'generic-texts.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the markdown file with frontmatter
    const { data } = matter(fileContent);
    
    // Return the texts object from frontmatter
    return NextResponse.json(data.texts || {});
  } catch (error) {
    console.error('Error reading generic texts:', error);
    return NextResponse.json({ error: 'Failed to read generic texts' }, { status: 500 });
  }
}
