/**
 * HOME PAGE COMPONENT
 *
 * Server Component — fetches all data directly from lib functions,
 * bypassing HTTP entirely. Works on both localhost and Vercel.
 */
import { getAllBlocksData } from "@/lib/content";
import { getTagline } from "@/lib/tagline";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import HomeClient from './HomeClient';

async function getHomeData() {
  const filePath = path.join(process.cwd(), 'content', 'generic-texts.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContent);

  const [blocks, tagline] = await Promise.all([
    getAllBlocksData('home'),
    Promise.resolve(getTagline()),
  ]);

  return {
    blocks,
    tagline,
    genericTexts: data.texts || {},
  };
}

export default async function Home() {
  const { blocks, tagline, genericTexts } = await getHomeData();
  return <HomeClient blocks={blocks} tagline={tagline} genericTexts={genericTexts} />;
}