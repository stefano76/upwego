import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
    
    // Extract items from frontmatter and sort by order
    const items = data.items || [];
    return items.sort((a: MenuItemFields, b: MenuItemFields) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    // Fallback to hardcoded data if file reading fails
    return [
      { title: "Home", slug: "/", order: 1 },
      { title: "About", slug: "about", order: 2 },
      { title: "Process", slug: "process", order: 3 },
      { title: "Services", slug: "services", order: 4 },
      { title: "Linkedin", slug: "https://linkedin.com/company/upwego", order: 5 },
      { title: "Contact us", slug: "#contact", order: 6 }
    ];
  }
}