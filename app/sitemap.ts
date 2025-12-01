import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/metadata';
import { getMenuItems } from '@/lib/menu';

/**
 * SITEMAP GENERATION
 * 
 * Generates a sitemap.xml file for SEO purposes.
 * Next.js automatically serves this at /sitemap.xml
 * 
 * The sitemap includes:
 * - All internal pages from menu items
 * - Static pages (privacy)
 * - Excludes external URLs and anchor links
 * 
 * UPDATES:
 * - Automatically updates when menu items change
 * - Uses base URL from environment variable or default
 * - Sets priority and change frequency for SEO
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  
  // Get menu items to determine which pages exist
  const menuItems = await getMenuItems();
  
  // Filter out external URLs and anchor links, keep only internal pages
  const internalPages = menuItems
    .filter(item => {
      // Exclude external URLs
      if (item.slug.startsWith('http')) return false;
      // Exclude anchor links
      if (item.slug.startsWith('#')) return false;
      return true;
    })
    .map(item => {
      // Convert slug to pathname format
      const pathname = item.slug === '/' || item.slug === '' ? '/' : `/${item.slug}`;
      return pathname;
    });

  // Add static pages that might not be in menu (like privacy)
  const staticPages = ['/privacy'];
  
  // Combine and deduplicate
  const allPages = [...new Set([...internalPages, ...staticPages])];

  // Generate sitemap entries
  const sitemapEntries: MetadataRoute.Sitemap = allPages.map((pathname) => {
    // Homepage gets highest priority
    const isHomepage = pathname === '/';
    
    return {
      url: `${baseUrl}${pathname}`,
      lastModified: new Date(),
      changeFrequency: isHomepage ? 'weekly' : 'monthly',
      priority: isHomepage ? 1.0 : 0.8,
    };
  });

  return sitemapEntries;
}
