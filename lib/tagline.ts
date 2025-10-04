import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Simple function to get the tagline from tagline.md
 * Can be used anywhere in the application
 */
export function getTagline(): string {
  try {
    const filePath = path.join(process.cwd(), 'content', 'tagline.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    return data.tagline;
  } catch (error) {
    console.error('Error fetching tagline:', error);
    return '';
  }
}
