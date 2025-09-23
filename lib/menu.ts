import getContentfulClient from "./contentful";
import { Entry, EntrySkeletonType } from "contentful";

type MenuItemFields = {
  title: string;
  slug: string;
  order: number;
};

type MenuItemSkeleton = EntrySkeletonType<MenuItemFields, "menuItem">;

export async function getMenuItems() {
  try {
    const client = getContentfulClient();
    const res = await client.getEntries<MenuItemSkeleton>({
      content_type: "menuItem",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: ["fields.order"] as any
    });

    return res.items
      .map((item: Entry<MenuItemSkeleton>) => {
        const title = item.fields.title;
        const slug = item.fields.slug;
        const order = item.fields.order;

        // Ensure we have valid data
        if (!title || !slug || typeof order !== 'number') {
          return null;
        }

        return {
          title: typeof title === 'string' ? title : title['en-US'] || '',
          slug: typeof slug === 'string' ? slug : slug['en-US'] || '',
          order: typeof order === 'number' ? order : order['en-US'] || 0,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}