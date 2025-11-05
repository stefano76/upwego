import type { JSX } from "react";
import { useEffect, useRef } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);

  const menuVariants = tv({
    base: "main-menu-container fixed bg-blueExtraLight w-full tablet:w-2/3 h-[100vh] right-0 top-[0] overflow-x-hidden pt-30 z-[100]",
    variants: {
      menuOpen: {
        true: "pointer-events-auto",
        false: "pointer-events-none",
      },
    },
  });

  const menuClasses = menuVariants({ menuOpen });
  
  useEffect(() => {
    // Apply transform and transition directly via inline styles
    if (menuRef.current) {
      const element = menuRef.current;
      
      // Set transition first
      element.style.transition = 'transform 1000ms ease-in-out';
      element.style.pointerEvents = menuOpen ? 'auto' : 'none';
      
      // Use setTimeout to ensure transition is applied before transform
      setTimeout(() => {
        if (element) {
          const transform = menuOpen ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)';
          element.style.transform = transform;
        }
      }, 10);
    }
  }, [menuOpen, menuClasses]);

  return (
    <div ref={menuRef} className={menuClasses}>
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
