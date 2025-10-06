"use client";
import React, { useState } from "react";
import type { JSX } from "react";
import Menu from "./Menu";
import MenuOpenButton from "./MenuToggle";
import Logo from "./components/Logo";
import { useAnimation } from "./components/AnimationContext";
import LinkedInIcon from "./components/LinkedInIcon";

type MenuItem = {
  title: string;
  slug: string;
};

type HeaderProps = {
  menuItems: MenuItem[];
  onContactClick?: () => void;
};

export default function Header({ menuItems, onContactClick }: HeaderProps): JSX.Element {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { shouldAnimate } = useAnimation();

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`header-container fixed top-0 z-50 w-full dark bg-brand-primary ${shouldAnimate ? 'animate-header-in opacity-0' : 'opacity-100'}`}>
      <header className="flex items-center justify-between py-[var(--header-padding-y)] container">
        <Logo
          width={180}
          height={31}
          className="w-[180px] h-[31px]"
        />
        
        {/* Desktop: Horizontal menu */}
        <nav className="hidden desktop:flex items-center gap-12 desktop-nav-menu">
          {menuItems.map((item) => {
            // Determine href based on slug type
            let href = item.slug;
            let target = undefined;
            let rel = undefined;
            
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
            } else {
              // Internal page
              href = `/${item.slug}`;
            }

            // Handle contact link specially
            if (item.slug === '#contact' && onContactClick) {
              return (
                <button
                  key={item.slug}
                  onClick={onContactClick}
                  className={`menu-item menu-item-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')} btn-secondary`}
                >
                  {item.title}
                </button>
              );
            }

            return (
              <a
                key={item.slug}
                href={href}
                target={target}
                rel={rel}
                className={`menu-item menu-item-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                  ${item.slug === '#contact' ? 'btn-secondary' : ''}
                  ${typeof window !== "undefined" && window.location.pathname === "/" && (item.slug === "" || item.slug === "/") ? " active" : ""}
                  ${typeof window !== "undefined" && (window.location.pathname === "/" + item.slug) ? ' active' : ''}`}
              >
                {item.title === "Linkedin" ? <LinkedInIcon size={28} /> : item.title}
              </a>
            );
          })}
        </nav>
        
        {/* Mobile: Burger button */}
        <div className="desktop:hidden">
          <MenuOpenButton openMenu={openMenu} />
        </div>
      </header>
      
      {/* Mobile: Slide-out menu */}
      <div className="desktop:hidden">
        <Menu menuOpen={menuOpen} menuItems={menuItems} onClose={closeMenu} onContactClick={onContactClick} />
      </div>
    </div>
  );
}