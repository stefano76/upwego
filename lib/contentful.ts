import { createClient } from "contentful";

// Lazy initialization of Contentful client
let client: ReturnType<typeof createClient> | null = null;

function getContentfulClient() {
  if (client) {
    return client;
  }

  // Validate environment variables
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId) {
    throw new Error('CONTENTFUL_SPACE_ID environment variable is required');
  }

  if (!accessToken) {
    throw new Error('CONTENTFUL_ACCESS_TOKEN environment variable is required');
  }

  client = createClient({
    space: spaceId,
    accessToken: accessToken,
  });

  return client;
}

export default getContentfulClient;