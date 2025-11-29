import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'contact-section-texts.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the markdown file with frontmatter
    const { data } = matter(fileContent);
    
    // Return the texts object from frontmatter
    return NextResponse.json({
      contactText: data.contactText || 'Get in touch with us',
      contactCTA: data.contactCTA || 'Contact Us',
      bookText: data.bookText || 'Schedule a consultation',
      bookCTA: data.bookCTA || 'Book a free meeting'
    });
  } catch (error) {
    console.error('Error reading contact section texts:', error);
    return NextResponse.json({ error: 'Failed to read contact section texts' }, { status: 500 });
  }
}
