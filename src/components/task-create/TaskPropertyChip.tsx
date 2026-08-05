import type { ReactNode } from "react";

interface TaskPropertyChipProps {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
}

export function TaskPropertyChip({
  children,
  icon,
  onClick,
  className = "",
}: TaskPropertyChipProps) {
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
