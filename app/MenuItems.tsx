"use client";
import Link from "next/link";

type MenuItem = {
  title: string;
  slug: string;
};

type MenuItemsProps = {
  menuItems: MenuItem[];
};

export default function MenuItems({ menuItems = [] }: MenuItemsProps) {
  console.debug("MenuItems:", menuItems);

  return (
    <nav className="p-4">
        <ul className="flex flex-col gap-2">
          {menuItems.map(item => (
            <li key={item.slug}>
              <Link href={item.slug} className="text-lg text-[var(--foreground)] hover:underline">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
  );
}