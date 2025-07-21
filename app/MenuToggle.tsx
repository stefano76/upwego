import type { JSX } from "react";

type MenuToggleProps = {
  menuOpen: boolean;
  toggleMenu: () => void;
  isDark: boolean;
};

export default function MenuToggle({ menuOpen, toggleMenu, isDark }: MenuToggleProps): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <button
        className="w-10 h-10 flex flex-col justify-center items-center group cursor-pointer"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={toggleMenu}
      >
        <span
          className={`block h-[2px] ${isDark ? "bg-white" : "bg-gray-800"} rounded transition-all duration-300 origin-top-left
            ${menuOpen ? "rotate-45 w-[18px] translate-x-[4px]" : "w-[20px]"}`}
        />
        <span
          className={`block h-[2px] ${isDark ? "bg-white" : "bg-gray-800"} rounded transition-all duration-300 my-1
            ${menuOpen ? "opacity-0 w-[15px]" : "w-[20px]"}`}
        />
        <span
          className={`block h-[2px] ${isDark ? "bg-white" : "bg-gray-800"} rounded transition-all duration-300 origin-bottom-left
            ${menuOpen ? "-rotate-45 w-[18px] translate-x-[4px]" : "w-[20px]"}`}
        />
      </button>
    </div>
  );
}