import type { JSX } from "react";

type MenuToggleProps = {
  openMenu: () => void;
};

export default function MenuOpenButton({ openMenu }: MenuToggleProps): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <button
        className="w-10 h-10 flex flex-col justify-center items-center group cursor-pointer mt-[-9px]"
        aria-label="Open menu"
        onClick={openMenu}
      >
        <span
          className={`block h-[2px] bg-brand-tertiary rounded w-9`}
        />
        <span
          className={`block h-[2px] bg-brand-tertiary rounded my-2 w-9`}
        />
        <span
          className={`block h-[2px] bg-brand-tertiary rounded w-9`}
        />
      </button>
    </div>
  );
}