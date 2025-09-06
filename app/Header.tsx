"use client";
import React, { useState, useEffect } from "react";
import type { JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Menu from "./Menu";
import MenuOpenButton from "./MenuToggle";

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

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    window.localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <div className="header-container">
      <header className="p-4 flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleTheme}
            className="sr-only"
            aria-label="Toggle dark mode"
          />
          <FontAwesomeIcon
            icon={isDark ? faSun : faMoon}
            className={`text-xl ${isDark ? "text-white" : "text-gray-800"} transition-colors`}
          />
        </label>
        <h1 className="text-[24px] font-bold tracking-tight text-[var(--foreground)]">Upwego</h1>
        <MenuOpenButton menuOpen={menuOpen} openMenu={openMenu} isDark={isDark} />
        {/* <div className="flex items-center gap-4">
        </div> */}
      </header>
      <Menu menuOpen={menuOpen} menuItems={menuItems} onClose={closeMenu} />
    </div>
  );
}