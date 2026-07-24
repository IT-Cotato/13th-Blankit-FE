import type { ButtonHTMLAttributes, ReactNode } from "react";

type TopBarIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function TopBarIconButton({ children, className = "", ...props }: TopBarIconButtonProps) {
  return (
    <button
      type="button"
      className={`flex aspect-square h-9 w-9 items-center justify-center gap-2.5 rounded-[55px] bg-black-800 p-1 text-black-500 transition-colors hover:text-black-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
