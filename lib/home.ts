/* eslint-disable @typescript-eslint/no-explicit-any */
import client from "./contentful";
import { Entry, EntrySkeletonType } from "contentful";
import { Document } from "@contentful/rich-text-types";

// Block content type
type BlockFields = {
  id?: string;
  name?: string;
  title?: Document;
  text?: Document;
  linkText?: string;
  linkUrl?: string;
};

type BlockSkeleton = EntrySkeletonType<BlockFields, "block">;

// Section content type
type SectionFields = {
  id?: string;
  type?: string;
  page: Entry<any>;
  title?: Document;
  blocks?: Entry<BlockSkeleton>[];
};

type SectionSkeleton = EntrySkeletonType<SectionFields, "section">;

// Page content type
type PageFields = {
  title: string;
  slug: string;
  sections: Entry<SectionSkeleton>[];
};

type PageSkeleton = EntrySkeletonType<PageFields, "page">;

export async function getHomeContent() {
  try {
    const res = await client.getEntries<PageSkeleton>({
      content_type: "page",
      "fields.slug": "/",
      limit: 1,
      include: 3
    } as any);

    return res.items[0];
  } catch (error) {
    console.error('Error fetching home content:', error);
    return null;
  }
}

export async function getHomeSections() {
  const homePage = await getHomeContent();
  return homePage?.fields?.sections || [];
}

export async function getIntroSection() {
  const sections = await getHomeSections();
  return sections.find((section: any) => section.fields.id === "home-intro") || null;
}

export async function getAllSectionFields() {
  const sections = await getHomeSections();
  return sections.map((section: any) => ({
    id: section.sys.id,
    title: section.fields.title,
    blocks: section.fields.blocks || []
  }));
}

export async function getAllBlocksData() {
  const sections = await getHomeSections();
  const allSections: Record<string, Record<string, any>> = {};
  
  sections.forEach((section: any) => {
    if (section.fields.blocks) {
      allSections[section.fields.id] = {};
      section.fields.blocks.forEach((block: any) => {
        allSections[section.fields.id][block.fields.id] = {
          title: block.fields.title,
          text: block.fields.text,
          linkText: block.fields.linkText,
          linkUrl: block.fields.linkUrl
        };
      });
    }
  });
  
  return allSections;
}