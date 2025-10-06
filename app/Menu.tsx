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
  onContactClick?: () => void;
};

export default function Menu({ menuOpen, menuItems, onClose, onContactClick }: MenuProps): JSX.Element {

  const menuVariants = tv({
    base: "main-menu-container fixed bg-blueExtraLight w-full tablet:w-2/3 h-[100vh] right-0 top-[0] overflow-x-hidden pt-30 transition-transform duration-1000 ease-in-out",
    variants: {
      menuOpen: {
        true: "translate-x-0",
        false: "translate-x-full",
      },
    },
  });

  return (
    <div className={menuVariants({ menuOpen })}>
      <div>
        <button
          className="absolute top-4 right-7 text-5xl text-brand-primary"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      <MenuItems menuItems={menuItems} onContactClick={onContactClick} />
    </div>
  );
}
