import xIcon from "@/assets/icons/x-black-600.svg";

import { getCategoryPresentation } from "@/constants/category";
import { CategoryIconBadge } from "./CategoryIconBadge";

import type { Category } from "@/types/category";

interface CategoryChipProps {
  category: Category;
  selected?: boolean;
  editable?: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

export function CategoryChip({
  category,
  selected = false,
  editable = false,
  onClick,
  onDelete,
}: CategoryChipProps) {
  const presentation = getCategoryPresentation(category);

  return (
    <div
      className={`flex h-12 items-center rounded-[6px] bg-black-800 px-2.5 ${
        selected ? "ring-1 ring-green-500" : ""
      }`}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className="flex min-w-0 items-center gap-2"
      >
        <CategoryIconBadge
          icon={presentation.icon}
          color={presentation.color}
          size={16}
          withBackground={false}
        />

        <span className="max-w-[120px] truncate text-[14px] font-medium text-black-100">
          {category.categoryName}
        </span>
      </button>

      {editable && (
        <button
          type="button"
          aria-label={`${category.categoryName} 삭제`}
          onClick={onDelete}
          className="ml-2 flex h-2.5 w-2.5 shrink-0 items-center justify-center"
        >
          <img
            src={xIcon}
            alt=""
            className="h-4 w-4"
          />
        </button>
      )}
    </div>
  );
}
