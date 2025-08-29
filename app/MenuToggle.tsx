import type { JSX } from "react";

type MenuToggleProps = {
  menuOpen: boolean;
  openMenu: () => void;
  isDark: boolean;
};

export default function MenuOpenButton({ menuOpen, openMenu, isDark }: MenuToggleProps): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <button
        className="w-10 h-10 flex flex-col justify-center items-center group cursor-pointer"
        aria-label="Open menu"
        onClick={openMenu}
      >
        <span
          className={`block h-[2px] ${isDark ? "bg-white" : "bg-gray-800"} rounded w-[20px]`}
        />
        <span
          className={`block h-[2px] ${isDark ? "bg-white" : "bg-gray-800"} rounded my-1 w-[20px]`}
        />
        <span
          className={`block h-[2px] ${isDark ? "bg-white" : "bg-gray-800"} rounded w-[20px]`}
        />
      </button>
    </div>
  );
}