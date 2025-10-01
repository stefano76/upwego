"use client";
import Link from "next/link";
import LinkedInIcon from "./components/LinkedInIcon";

type MenuItem = {
  title: string;
  slug: string;
};

type MenuItemsProps = {
  menuItems: MenuItem[];
};

export default function MenuItems({ menuItems = [] }: MenuItemsProps) {
  // console.debug("MenuItems:", menuItems);

  return (
    <nav className="p-4">
        <ul className="flex flex-col gap-2">
          {menuItems.map(item => {
            // Determine href and component type based on slug
            let href = item.slug;
            let target = undefined;
            let rel = undefined;
            let useLink = false;
            
            if (item.slug.startsWith('http')) {
              // External URL (like LinkedIn)
              href = item.slug;
              target = "_blank";
              rel = "noopener noreferrer";
            } else if (item.slug.startsWith('#')) {
              // Anchor link (like #contact)
              href = item.slug;
            } else if (item.slug === '/' || item.slug === '') {
              // Home page
              href = '/';
              useLink = true;
            } else {
              // Internal page
              href = `/${item.slug}`;
              useLink = true;
            }

            const className = `text-lg text-[var(--foreground)] menu-item menu-item-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')} ${item.slug === '#contact' ? 'btn-secondary' : 'hover:underline'}`;

            return (
              <li key={item.slug}>
                {useLink ? (
                  <Link href={href} className={className}>
                    {item.title === "Linkedin" ? <LinkedInIcon size={24} /> : item.title}
                  </Link>
                ) : (
                  <a 
                    href={href} 
                    target={target} 
                    rel={rel}
                    className={className}
                  >
                    {item.title === "Linkedin" ? <LinkedInIcon size={24} /> : item.title}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
  );
}