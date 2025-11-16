/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Generic function to get page content from content/pages/{pageName}.md
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
 * Generic function to get sections for a page
 */
export async function getPageSections(pageName: string) {
  const page = await getPageContent(pageName);
  return page?.fields?.sections || [];
}

/**
 * Generic function to get all blocks data for any page
 * Works for home, process, services, etc.
 */
export async function getAllBlocksData(pageName: string) {
  const sections = await getPageSections(pageName);
  const allSections: Record<string, any> = {};
  
  for (const sectionId of sections) {
    try {
      // Read section file to get blocks list
      const sectionFilePath = path.join(process.cwd(), 'content', 'sections', `${sectionId}.md`);
      const sectionFileContents = fs.readFileSync(sectionFilePath, 'utf8');
      const { data: sectionData } = matter(sectionFileContents);
      
      allSections[sectionId] = {
        title: sectionData.title,
        blocks: {}
      };
      
      // Read each block file
      if (sectionData.blocks && Array.isArray(sectionData.blocks)) {
        for (const blockId of sectionData.blocks) {
          try {
            const blockFilePath = path.join(process.cwd(), 'content', 'blocks', `${blockId}.md`);
            const blockFileContents = fs.readFileSync(blockFilePath, 'utf8');
            const { data: blockData } = matter(blockFileContents);
            
            allSections[sectionId].blocks[blockId] = {
              title: blockData.title,
              text: blockData.text,
              label: blockData.label,
              linkText: blockData.linkText,
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
      allSections[sectionId] = { title: '', blocks: {} };
    }
  }
  
  return allSections;
}

