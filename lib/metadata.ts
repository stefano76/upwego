import type { Metadata } from "next";

/**
 * METADATA CONFIGURATION
 * 
 * Centralized metadata configuration for all pages.
 * Each page can have its own title, description, and Open Graph tags.
 * 
 * USAGE:
 * - Import generatePageMetadata() in page layouts
 * - Pass the pathname to get complete metadata object
 */

export interface PageMetadata {
  title: string;
  description: string;
}

/**
 * Open Graph image configuration
 * Path is relative to the public folder
 */
export const OG_IMAGE_PATH = '/img/upwego-image.png';

export const pageMetadata: Record<string, PageMetadata> = {
  '/': {
    title: 'Upwego Digital - Designing momentum. Together.',
    description: 'We elevate our clients’ foundations, crafting digital experiences that marry creativity with innovation, turning their business vision into reality.',
  },
  '/about': {
    title: 'About Us - Upwego Digital',
    description: 'Nadja Salewski and Stefano Bonuccelli combine web development experience with strategic data expertise to deliver elegant, effective digital solutions.',
  },
  '/services': {
    title: 'The Services - Upwego Digital',
    description: 'From stunning websites to smart data tools, we create digital solutions that make your brand shine and your business thrive.',
  },
  '/process': {
    title: 'Our Process - Upwego Digital',
    description: 'The best projects start with great conversations and end with lasting partnerships. Here’s how we take your ideas from first spark to real-world impact.',
  },
  '/privacy': {
    title: 'Website terms of use and privacy policy - Upwego Digital',
    description: 'These terms explain how you may use this site, copyright details, and our privacy policy on collecting and handling your personal information.',
  },
  '/cookies': {
    title: 'Cookie Policy - Upwego Digital',
    description: 'Learn about how we use cookies and similar tracking technologies on our website, and how you can manage your cookie preferences.',
  },
};

/**
 * Get metadata for a specific page route
 * Falls back to homepage metadata if route not found
 */
export function getPageMetadata(pathname: string): PageMetadata {
  return pageMetadata[pathname] || pageMetadata['/'];
}

/**
 * Get the base URL for the website
 * Uses environment variable or falls back to default domain
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.upwego.digital';
}

/**
 * Generate Open Graph image URL
 * Uses base URL from getBaseUrl() and OG_IMAGE_PATH constant
 */
export function getOgImageUrl(): string {
  return `${getBaseUrl()}${OG_IMAGE_PATH}`;
}

/**
 * Generate complete metadata object for a page
 * Includes title, description, Open Graph, and Twitter Card tags
 */
export function generatePageMetadata(pathname: string): Metadata {
  const baseUrl = getBaseUrl();
  const pageMetadata = getPageMetadata(pathname);
  const ogImageUrl = getOgImageUrl();
  const pageUrl = pathname === '/' ? baseUrl : `${baseUrl}${pathname}`;

  return {
    title: pageMetadata.title,
    description: pageMetadata.description,
    openGraph: {
      title: pageMetadata.title,
      description: pageMetadata.description,
      url: pageUrl,
      siteName: "Upwego Digital",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${pageMetadata.title} - ${pageMetadata.description}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageMetadata.title,
      description: pageMetadata.description,
      images: [ogImageUrl],
    },
  };
}
