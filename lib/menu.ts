import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
// import { getLinkedInLink } from './contact';

interface MenuItemFields {
  title: string;
  slug: string;
  order: number;
}

export async function getMenuItems(): Promise<MenuItemFields[]> {
  try {
    const filePath = path.join(process.cwd(), 'content', 'menu', 'items.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    // Extract items from frontmatter
    const items: MenuItemFields[] = data.items || [];
    
    // Remove any existing LinkedIn items (to avoid duplicates)
    const itemsWithoutLinkedIn = items.filter(item => 
      item.title.toLowerCase() !== "linkedin" && !item.slug.includes('linkedin.com')
    );
    
    // Dynamically inject LinkedIn menu item from contact links (single source of truth: content/contact/links.md)
    // const linkedInLink = getLinkedInLink();
    const linkedInLink = false;
    if (linkedInLink) {
      itemsWithoutLinkedIn.push({
        title: "Linkedin",
        slug: linkedInLink.url,
        order: 5
      });
    }
    
    // Sort by order
    return itemsWithoutLinkedIn.sort((a: MenuItemFields, b: MenuItemFields) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    // Fallback: return basic menu items, add LinkedIn if available
    // const linkedInLink = getLinkedInLink();
    const fallbackItems: MenuItemFields[] = [
      { title: "Home", slug: "/", order: 1 },
      { title: "About", slug: "about", order: 2 },
      { title: "Process", slug: "process", order: 3 },
      { title: "Services", slug: "services", order: 4 },
      // { title: "Linkedin", slug: linkedInLink?.url || "", order: 5 },
      { title: "Contact us", slug: "#contact", order: 6 }
    ];
    return fallbackItems.sort((a: MenuItemFields, b: MenuItemFields) => a.order - b.order);
  }
}