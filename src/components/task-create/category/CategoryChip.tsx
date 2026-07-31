import xIcon from "@/assets/icons/x-black-600.svg";

import { CategoryIconBadge } from "@/components/category/CategoryIconBadge";
import { getCategoryPresentation } from "@/constants/category";

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
      className={`flex h-12 max-w-full items-center rounded-[6px] px-2.5 ${
        selected ? "bg-black-700" : "bg-black-800"
      }`}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className="flex h-full min-w-0 flex-1 items-center gap-2"
      >
        <CategoryIconBadge
          icon={presentation.icon}
          color={presentation.color}
          size={16}
          withBackground={false}
        />

        <span className="min-w-0 truncate text-[14px] font-medium text-black-100">
          {category.categoryName}
        </span>
      </button>

      {editable && onDelete && (
        <button
          type="button"
          aria-label={`${category.categoryName} 삭제`}
          onClick={onDelete}
          className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center"
        >
          <img
            src={xIcon}
            alt=""
            className="h-2.5 w-2.5"
          />
        </button>
      )}
    </div>
  );
}
