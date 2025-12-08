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
 * - Static pages (privacy, cookies)
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

  // Add static pages that might not be in menu (legal pages)
  const staticPages = ['/privacy', '/cookies'];
  
  // Combine and deduplicate
  const allPages = [...new Set([...internalPages, ...staticPages])];

  // Generate sitemap entries with appropriate priorities and change frequencies
  const sitemapEntries: MetadataRoute.Sitemap = allPages.map((pathname) => {
    // Determine page type for priority and change frequency
    const isHomepage = pathname === '/';
    const isLegalPage = pathname === '/privacy' || pathname === '/cookies';
    const isMainPage = ['/about', '/services', '/process'].includes(pathname);
    
    // Set priority: Homepage (1.0) > Main pages (0.9) > Legal pages (0.5)
    let priority: number;
    if (isHomepage) {
      priority = 1.0;
    } else if (isMainPage) {
      priority = 0.9;
    } else if (isLegalPage) {
      priority = 0.5;
    } else {
      priority = 0.8; // Default for other pages
    }
    
    // Set change frequency: Homepage (weekly) > Main pages (monthly) > Legal pages (yearly)
    let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    if (isHomepage) {
      changeFrequency = 'weekly';
    } else if (isMainPage) {
      changeFrequency = 'monthly';
    } else if (isLegalPage) {
      changeFrequency = 'yearly';
    } else {
      changeFrequency = 'monthly'; // Default for other pages
    }
    
    return {
      url: `${baseUrl}${pathname}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });

  return sitemapEntries;
}
