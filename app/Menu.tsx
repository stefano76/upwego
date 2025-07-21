import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import type { JSX } from "react";
import { useState, useEffect } from "react";

type MenuProps = {
  menuOpen: boolean;
};

export default function Menu({ menuOpen }: MenuProps): JSX.Element {
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
    <div className={`main-menu-container fixed bg-[var(--background)] w-screen h-[calc(100vh-72px)] right-[-100vw] top-[72px] overflow-x-hidden
      ${menuOpen ? "-translate-x-full" : "translate-x-0"} transition-transform duration-1000 ease-in-out`}>
      {mounted && (
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
      )}
      <nav className="p-4">
        <ul className="flex flex-col gap-2">
          <li>
            <Link href="/" className="text-lg text-[var(--foreground)] hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-lg text-[var(--foreground)] hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-lg text-[var(--foreground)] hover:underline">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
