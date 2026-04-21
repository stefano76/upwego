/**
 * HOME PAGE SERVER COMPONENT
 * 
 * Server-side data fetching for the home page.
 * This component pre-fetches all required data before rendering,
 * eliminating the loading spinner and improving LCP metrics.
 */
import HomeClient from './HomeClient';

async function getHomeData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    
    // Fetch all data in parallel for better performance
    const [blocksResponse, taglineResponse, genericTextsResponse] = await Promise.all([
      fetch(`${baseUrl}/api/home`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/tagline`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/generic-texts`, { cache: 'no-store' })
    ]);

    const [blocks, taglineData, genericTexts] = await Promise.all([
      blocksResponse.json(),
      taglineResponse.json(),
      genericTextsResponse.json(),
    ]);

    return { 
      blocks, 
      tagline: taglineData.tagline, 
      genericTexts 
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    // Return empty data structure to prevent crashes
    return { 
      blocks: null, 
      tagline: '', 
      genericTexts: {} 
    };
  }
}

export default async function Home() {
  const { blocks, tagline, genericTexts } = await getHomeData();
  return <HomeClient blocks={blocks} tagline={tagline} genericTexts={genericTexts} />;
}
