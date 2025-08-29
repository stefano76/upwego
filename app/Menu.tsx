import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import type { JSX } from "react";
import { useState, useEffect } from "react";
import MenuItems from "./MenuItems";

type MenuItem = {
  title: string;
  slug: string;
};

type MenuProps = {
  menuOpen: boolean;
  menuItems: MenuItem[];
  onClose: () => void;
};

export default function Menu({ menuOpen, menuItems, onClose }: MenuProps): JSX.Element {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(window.localStorage.getItem("theme") === "dark");
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    window.localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <div className={`main-menu-container fixed bg-[#ccc] w-screen h-[100vh] right-[-100vw] top-[0] overflow-x-hidden pt-30
      ${menuOpen ? "-translate-x-full" : "translate-x-0"} transition-transform duration-1000 ease-in-out`}>
      {mounted && (
        <div>
          <label className="flex items-center cursor-pointer ml-4">
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
          <button
            className="absolute top-4 right-7 text-5xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
      )}
      <MenuItems menuItems={menuItems} />
    </div>
  );
}
