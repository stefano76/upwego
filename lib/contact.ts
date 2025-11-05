import fs from 'fs';
import path from 'path';

export interface ContactLink {
  svg: string;
  alt: string;
  label: string;
  url: string;
}

/**
 * Parse contact links from contact/links.md
 * Returns an array of contact link objects
 */
export function getContactLinks(): ContactLink[] {
  try {
    const filePath = path.join(process.cwd(), 'content', 'contact', 'links.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Split content by sections (##)
    const sections = fileContents.split('## ').slice(1); // Remove first empty element
    
    const contactLinks: ContactLink[] = [];
    
    sections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim());
      const contactLink: Partial<ContactLink> = {};
      
      lines.forEach(line => {
        if (line.startsWith('- svg:')) {
          contactLink.svg = line.replace('- svg:', '').trim().replace(/^["']|["']$/g, '');
        } else if (line.startsWith('- alt:')) {
          contactLink.alt = line.replace('- alt:', '').trim().replace(/^["']|["']$/g, '');
        } else if (line.startsWith('- label:')) {
          contactLink.label = line.replace('- label:', '').trim().replace(/^["']|["']$/g, '');
        } else if (line.startsWith('- url:')) {
          contactLink.url = line.replace('- url:', '').trim().replace(/^["']|["']$/g, '');
        }
      });
      
      // Only add if all required fields are present
      if (contactLink.svg && contactLink.alt && contactLink.label && contactLink.url) {
        contactLinks.push(contactLink as ContactLink);
      }
    });
    
    return contactLinks;
  } catch (error) {
    console.error('Error fetching contact links:', error);
    return [];
  }
}
