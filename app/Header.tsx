"use client";
import React, { useState, useEffect } from "react";
import type { JSX } from "react";
import Menu from "./Menu";
import MenuToggle from "./MenuToggle";

type MenuItem = {
  title: string;
  slug: string;
};

type HeaderProps = {
  menuItems: MenuItem[];
};

export default function Header({ menuItems }: HeaderProps): JSX.Element {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  /**
   * Initialize dark mode based on localStorage.
   * This way the theme persists across page reloads.
   */
  useEffect(() => {
    // Check localStorage or system preference
    const darkMode = window.localStorage.getItem("theme") === "dark";
      /*  ||
      (!window.localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches); */
    setIsDark(darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <div className="header-container">
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-tight text-[var(--foreground)]">Upwego</h1>
        <MenuToggle menuOpen={menuOpen} toggleMenu={toggleMenu} isDark={isDark} />
      </header>
      <Menu menuOpen={menuOpen} menuItems={menuItems} />
    </div>
  );
}