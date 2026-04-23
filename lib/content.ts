/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * CONTENT MANAGEMENT SYSTEM OVERVIEW
 * 
 * This file handles loading content from markdown files in the /content directory.
 * The structure is:
 * - content/pages/{pageName}.md - Defines which sections belong to a page
 * - content/sections/{sectionId}.md - Defines which blocks belong to a section
 * - content/blocks/{blockId}.md - Contains the actual content (title, text, images, etc.)
 * 
 * Example: The "about" page loads sections like "about-intro", "about-owners", etc.
 * Each section then loads its blocks (e.g., "about-intro-text.md").
 */

/**
 * Gets the page configuration from content/pages/{pageName}.md
 * 
 * Each page file contains frontmatter with:
 * - title: Page title
 * - slug: URL slug for the page
 * - sections: Array of section IDs that belong to this page
 * 
 * @param pageName - The name of the page (e.g., "about", "home", "services")
 * @returns Page configuration object or null if file doesn't exist
 */
export async function getPageContent(pageName: string) {
  try {
    const filePath = path.join(process.cwd(), 'content', 'pages', `${pageName}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      fields: {
        title: data.title,
        slug: data.slug,
        sections: data.sections
      }
    };
  } catch (error) {
    console.error(`Error fetching ${pageName} content:`, error);
    return null;
  }
}

/**
 * Extracts just the section IDs for a given page
 * 
 * This is a convenience function that gets the sections array from the page content.
 * Sections define the order and structure of content blocks on a page.
 * 
 * @param pageName - The name of the page
 * @returns Array of section IDs (e.g., ["about-intro", "about-owners", "about-values"])
 */
export async function getPageSections(pageName: string) {
  const page = await getPageContent(pageName);
  return page?.fields?.sections || [];
}

/**
 * MAIN CONTENT LOADER - Gets all content blocks for a page
 * 
 * This is the primary function used by API routes to load page content.
 * It follows this process:
 * 1. Gets the list of sections for the page (from pages/{pageName}.md)
 * 2. For each section, reads the section file to get its block IDs
 * 3. For each block ID, reads the block file and extracts its content
 * 
 * Returns a nested structure:
 * {
 *   "section-id": {
 *     title: "Section Title",
 *     blocks: {
 *       "block-id": {
 *         title: "Block Title",
 *         text: "Block content...",
 *         // ... other fields
 *       }
 *     }
 *   }
 * }
 * 
 * @param pageName - The name of the page (e.g., "about", "home", "services")
 * @returns Object containing all sections and their blocks for the page
 * 
 * USAGE EXAMPLE:
 * - API route: const blocks = await getAllBlocksData('about');
 * - Component: Fetches from /api/about which calls this function
 */
export async function getAllBlocksData(pageName: string) {
  const sections = await getPageSections(pageName);
  const allSections: Record<string, any> = {};
  
  // Process each section defined for this page
  for (const sectionId of sections) {
    try {
      // Read section file to get blocks list
      // Section files are in content/sections/{sectionId}.md
      const sectionFilePath = path.join(process.cwd(), 'content', 'sections', `${sectionId}.md`);
      const sectionFileContents = fs.readFileSync(sectionFilePath, 'utf8');
      const { data: sectionData } = matter(sectionFileContents);
      
      // Initialize section structure
      allSections[sectionId] = {
        title: sectionData.title,
        blocks: {}
      };
      
      // Load each block that belongs to this section
      // Blocks are defined in the section's frontmatter as an array
      if (sectionData.blocks && Array.isArray(sectionData.blocks)) {
        for (const blockId of sectionData.blocks) {
          try {
            // Read individual block file from content/blocks/{blockId}.md
            const blockFilePath = path.join(process.cwd(), 'content', 'blocks', `${blockId}.md`);
            const blockFileContents = fs.readFileSync(blockFilePath, 'utf8');
            const { data: blockData } = matter(blockFileContents);
            
            // Extract all block fields and add to section
            allSections[sectionId].blocks[blockId] = {
              title: blockData.title,
              text: blockData.text,
              label: blockData.label,
              linkText: blockData.linkText,
              linkTextMobile: blockData.linkTextMobile,
              linkUrl: blockData.linkUrl,
              number: blockData.number,
              slug: blockData.slug,
              features: blockData.features,
              cta: blockData.cta
            };
          } catch (blockError) {
            console.error(`Error reading block ${blockId}:`, blockError);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading section ${sectionId}:`, error);
      // Return empty section structure if file can't be read
      allSections[sectionId] = { title: '', blocks: {} };
    }
  }
  
  return allSections;
}

