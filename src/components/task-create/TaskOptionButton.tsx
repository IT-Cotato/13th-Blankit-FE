import type { ReactNode } from "react";

interface TaskOptionButtonProps {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
}

export function TaskOptionButton({
  children,
  icon,
  onClick,
  className = "",
}: TaskOptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 shrink-0 items-center gap-2 rounded-[6px] bg-black-800 px-4 text-[14px] font-medium text-black-100 ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}
