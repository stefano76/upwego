"use client";
import Link from "next/link";
import LinkedInLogo from "../LinkedInLogo";
import Button from "../Button";

type MenuItem = {
  title: string;
  slug: string;
};

type MenuItemsProps = {
  menuItems: MenuItem[];
  onContactClick?: () => void;
};

export default function MenuItems({ menuItems = [], onContactClick }: MenuItemsProps) {
  // Sort menu items to put LinkedIn last
  const sortedMenuItems = [...menuItems].sort((a, b) => {
    if (a.title === "Linkedin") return 1;
    if (b.title === "Linkedin") return -1;
    return 0;
  });

  return (
    <nav className="p-4 pt-16">
        <ul className="flex flex-col gap-2">
          {sortedMenuItems.map(item => {
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

            const className = `text-3xl text-center block my-4 text-brand-primary menu-item-mobile menu-item-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')} ${item.slug === '#contact' ? 'btn-secondary' : 'hover:underline'}`;

            // Handle contact link specially
            if (item.slug === '#contact' && onContactClick) {
              return (
                <li key={item.slug}>
                  <Button onClick={onContactClick} className={className}>
                    {item.title}
                  </Button>
                </li>
              );
            }

            return (
              <li key={item.slug}>
                {useLink ? (
                  <Link href={href} className={className}>{item.title}</Link>
                ) : (
                  <a 
                    href={href} 
                    target={target} 
                    rel={rel}
                    className={className}
                  >
                    {item.title === "Linkedin" ? <LinkedInLogo width={111} height={30} className="w-[111px] h-[30px] mx-auto" fill="var(--brand-primary)" /> : item.title}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
  );
}

