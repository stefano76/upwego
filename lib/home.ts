/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getHomeContent() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'pages', 'home.md');
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
    console.error('Error fetching home content:', error);
    return null;
  }
}

export async function getHomeSections() {
  const homePage = await getHomeContent();
  return homePage?.fields?.sections || [];
}

export async function getAllBlocksData() {
  const sections = await getHomeSections();
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
              linkUrl: blockData.linkUrl
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