"use client";
import React, { useState } from "react";
import type { JSX } from "react";
import Menu from "./Menu";
import MenuOpenButton from "./MenuToggle";
import Logo from "./components/Logo";
import { useAnimation } from "./components/AnimationContext";

type MenuItem = {
  title: string;
  slug: string;
};

type HeaderProps = {
  menuItems: MenuItem[];
};

export default function Header({ menuItems }: HeaderProps): JSX.Element {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { shouldAnimate } = useAnimation();

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`header-container fixed top-0 z-50 w-full dark ${shouldAnimate ? 'animate-header-in opacity-0' : 'opacity-100'}`}>
      <header className="flex items-center justify-between py-8 container-padding">
        <Logo
          width={180}
          height={31}
          className="w-[180px] h-[31px]"
        />
        
        {/* Desktop: Horizontal menu */}
        <nav className="hidden desktop:flex items-center space-x-6">
          {menuItems.map((item) => (
            <a
              key={item.slug}
              href={item.slug === '' || item.slug === '/' ? '/' : `/${item.slug}`}
              className="text-[var(--foreground)] hover:text-[var(--brand-secondary)] transition-colors"
            >
              {item.title}
            </a>
          ))}
        </nav>
        
        {/* Mobile: Burger button */}
        <div className="desktop:hidden">
          <MenuOpenButton openMenu={openMenu} isDark={false} />
        </div>
      </header>
      
      {/* Mobile: Slide-out menu */}
      <div className="desktop:hidden">
        <Menu menuOpen={menuOpen} menuItems={menuItems} onClose={closeMenu} />
      </div>
    </div>
  );
}