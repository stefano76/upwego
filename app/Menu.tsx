import type { JSX } from "react";
import MenuItems from "./MenuItems";
import { tv } from 'tailwind-variants';

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

  const menuVariants = tv({
    base: "main-menu-container fixed bg-[#ccc] w-screen h-[100vh] right-[-100vw] top-[0] overflow-x-hidden pt-30 transition-transform duration-1000 ease-in-out",
    variants: {
      menuOpen: {
        true: "-translate-x-full",
        false: "translate-x-0",
      },
    },
  });

  return (
    <div className={menuVariants({ menuOpen })}>
      <div>
        <button
          className="absolute top-4 right-7 text-5xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      <MenuItems menuItems={menuItems} />
    </div>
  );
}
