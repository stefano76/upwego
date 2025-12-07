"use client";
import React, { useState, useEffect } from "react";
import type { JSX } from "react";
import { usePathname } from "next/navigation";
import Menu from "./components/Menu";
import MenuOpenButton from "./MenuToggle";
import Logo from "./components/Logo";
import { useAnimation } from "./components/AnimationContext";
import LinkedInIcon from "./components/LinkedInIcon";
import tailwindConfig from "../tailwind.config.mjs";

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
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const { shouldAnimate } = useAnimation();
  const pathname = usePathname();
  const tabletBreakpoint = parseInt(tailwindConfig.theme.extend.screens.tablet);
  const desktopBreakpoint = parseInt(tailwindConfig.theme.extend.screens.desktop);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  // Track viewport width
  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);

    return () => {
      window.removeEventListener('resize', updateViewportWidth);
    };
  }, []);

  // Handle scroll to change header background (only on process page)
  useEffect(() => {
    // Only apply scroll effect on process page and when viewport is larger than tablet
    if (pathname !== '/process' || viewportWidth < tabletBreakpoint) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const scrollOffset = viewportWidth < desktopBreakpoint ? 30 : 100;
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPosition > scrollOffset);
    };

    // Check initial scroll position
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, viewportWidth, tabletBreakpoint, desktopBreakpoint]);

  // Close menu when route changes (for mobile navigation)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className={`header-container fixed top-0 z-50 w-full dark bg-brand-primary transition-colors duration-300 ${!isScrolled ? 'bg-opacity-0' : ''} ${shouldAnimate ? 'animate-header-in opacity-0' : 'opacity-100'}`}>
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
            let target: string | undefined = undefined;
            let rel: string | undefined = undefined;
            
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

            // Determine if this is the active page
            const isActive = pathname === "/" && (item.slug === "" || item.slug === "/") 
              ? true 
              : pathname === "/" + item.slug;

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
                  ${isActive ? ' active' : ''}`}
                aria-label={item.title}
              >
                {item.title === "Linkedin" ? (
                  <>
                    <LinkedInIcon size={28} aria-hidden="true" />
                    <span className="sr-only">LinkedIn</span>
                  </>
                ) : item.title}
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