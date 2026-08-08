import backIcon from "@/assets/icons/header/back-black-700.svg";

import { CategoryChip } from "./CategoryChip";

import type { Category } from "@/types/category";

interface CategoryListSheetProps {
  categories: Category[];
  selectedCategoryId: number | null;
  editable: boolean;
  loading?: boolean;
  onBack: () => void;
  onStartCreate: () => void;
  onToggleEdit: () => void;
  onSelect: (category: Category) => void;
  onStartUpdate: (category: Category) => void;
  onRequestDelete: (category: Category) => void;
}

export function CategoryListSheet({
  categories,
  selectedCategoryId,
  editable,
  loading = false,
  onBack,
  onStartCreate,
  onToggleEdit,
  onSelect,
  onStartUpdate,
  onRequestDelete,
}: CategoryListSheetProps) {
  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="카테고리 선택"
      className="fixed inset-x-0 bottom-0 z-[70] max-h-[calc(100dvh-16px)] min-h-[260px] overflow-y-auto overscroll-contain rounded-t-[24px] bg-black-850 px-5 pb-6 pt-5"
    >
      <header className="flex items-center gap-3">
        <button
          type="button"
          aria-label="과업 입력으로 돌아가기"
          onClick={onBack}
          className="flex h-6 w-3 shrink-0 items-center justify-start"
        >
          <img
            src={backIcon}
            alt=""
            className="h-3 w-2"
          />
        </button>

        <button
          type="button"
          aria-label="카테고리 추가하기"
          onClick={onStartCreate}
          className="h-11 min-w-0 flex-1 rounded-[8px] bg-black-800 px-4 text-left text-[16px] text-black-500"
        >
          카테고리 추가하기
        </button>

        <button
          type="button"
          onClick={onToggleEdit}
          className="shrink-0 text-[14px] font-medium text-black-400"
        >
          {editable ? "완료" : "편집"}
        </button>
      </header>

      {loading ? (
        <p className="py-10 text-center text-[13px] text-black-500">
          카테고리를 불러오는 중이에요.
        </p>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          {categories.map((category) => (
            <CategoryChip
              key={category.categoryId}
              category={category}
              selected={category.categoryId === selectedCategoryId}
              editable={editable}
              onClick={() =>
                editable ? onStartUpdate(category) : onSelect(category)
              }
              onDelete={() => onRequestDelete(category)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
