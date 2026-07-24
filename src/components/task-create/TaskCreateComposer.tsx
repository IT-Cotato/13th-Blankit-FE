import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import arrowRightIcon from "@/assets/icons/arrow/arrow-pointing-right.svg";
import calendarIcon from "@/assets/icons/bottom-nav/calendar-green.svg";
import alarmIcon from "@/assets/icons/task/alarm-icon.svg";
import categoryIcon from "@/assets/icons/task/category_icon.svg";

import {
  createCategory,
  deleteCategory,
  getAvailableCategoryColors,
  getCategories,
  updateCategory,
} from "@/api/categories";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { CategoryFormSheet } from "@/components/task-create/category/CategoryFormSheet";
import { CategoryIconBadge } from "@/components/task-create/category/CategoryIconBadge";
import { CategoryManagerSheet } from "@/components/task-create/category/CategoryManagerSheet";

import { getCategoryPresentation } from "@/constants/category";

import type {
  Category,
  CategoryIconKey,
  CategoryMutationRequest,
} from "@/types/category";

export interface TaskCreateComposerHandle {
  focus: () => void;
}

interface TaskCreateComposerProps {
  title: string;
  onTitleChange: (title: string) => void;
  onClose: () => void;
  onNext: () => void;
}

type ComposerView = "composer" | "category-list" | "category-form";
type CategoryFormMode = "create" | "update";

export const TaskCreateComposer = forwardRef<
  TaskCreateComposerHandle,
  TaskCreateComposerProps
>(function TaskCreateComposer(
  {
    title,
    onTitleChange,
    onClose,
    onNext,
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState<ComposerView>("composer");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);
  const [pendingDeleteCategory, setPendingDeleteCategory] =
    useState<Category | null>(null);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [formMode, setFormMode] =
    useState<CategoryFormMode>("create");
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canContinue = title.trim().length > 0;
  const selectedCategoryPresentation = selectedCategory
    ? getCategoryPresentation(selectedCategory)
    : null;

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
  }));

  function focusTaskInput() {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function showError(error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "요청을 처리하지 못했습니다.";

    setErrorMessage(message);
    window.setTimeout(() => {
      setErrorMessage(null);
    }, 2500);
  }

  async function handleOpenCategories() {
    setView("category-list");
    setEditable(false);
    setLoading(true);
    setErrorMessage(null);

    try {
      const nextCategories = await getCategories();
      setCategories(nextCategories);

      if (!selectedCategory && nextCategories.length > 0) {
        setSelectedCategory(nextCategories[0]);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStartCreate() {
    try {
      setLoading(true);
      const colors = await getAvailableCategoryColors();
      setAvailableColors(colors);
      setEditingCategory(null);
      setFormMode("create");
      setView("category-form");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStartUpdate(category: Category) {
    try {
      setLoading(true);
      const colors = await getAvailableCategoryColors(category.categoryId);
      setAvailableColors(colors);
      setEditingCategory(category);
      setFormMode("update");
      setView("category-form");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitCategory(
    values: CategoryMutationRequest,
    iconKey: CategoryIconKey,
  ) {
    try {
      setSubmitting(true);

      if (formMode === "create") {
        const created = await createCategory(values, iconKey);
        setCategories((current) => [...current, created]);
        setSelectedCategory(created);
      } else if (editingCategory) {
        const updated = await updateCategory(
          editingCategory.categoryId,
          values,
          iconKey,
        );

        setCategories((current) =>
          current.map((category) =>
            category.categoryId === updated.categoryId
              ? updated
              : category,
          ),
        );

        if (selectedCategory?.categoryId === updated.categoryId) {
          setSelectedCategory(updated);
        }
      }

      setEditingCategory(null);
      setView("category-list");
    } catch (error) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteCategory) {
      return;
    }

    try {
      setSubmitting(true);
      await deleteCategory(pendingDeleteCategory.categoryId);

      const deletedCategoryId = pendingDeleteCategory.categoryId;
      const remaining = categories.filter(
        (category) => category.categoryId !== deletedCategoryId,
      );

      setCategories(remaining);

      if (selectedCategory?.categoryId === deletedCategoryId) {
        setSelectedCategory(remaining[0] ?? null);
      }

      setPendingDeleteCategory(null);
    } catch (error) {
      setPendingDeleteCategory(null);
      showError(error);
    } finally {
      setSubmitting(false);
    }
  }

  function handleSelectCategory(category: Category) {
    setSelectedCategory(category);
    setView("composer");
    focusTaskInput();
  }

  function handleBackToComposer() {
    setView("composer");
    setEditable(false);
    focusTaskInput();
  }

  return (
    <>
      <button
        type="button"
        aria-label="과업 입력 닫기"
        onClick={onClose}
        className="fixed inset-0 z-[60] cursor-default bg-black/80"
      />

      <section
          role="dialog"
          aria-modal="true"
          aria-label="과업 추가"
          aria-hidden={view !== "composer"}
          className={`fixed inset-x-0 bottom-0 z-[70] min-h-[150px] rounded-t-[24px] bg-black-850 px-5 pb-5 pt-6 transition-opacity ${
            view === "composer"
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={title}
              aria-label="과업명"
              placeholder="할 일을 입력하세요."
              onChange={(event) => onTitleChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && canContinue) {
                  onNext();
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-[18px] font-semibold leading-[150%] text-black-100 outline-none placeholder:text-black-200"
            />

            <button
              type="button"
              aria-label="다음"
              disabled={!canContinue}
              onClick={onNext}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              <img
                src={arrowRightIcon}
                alt=""
                className="h-[42px] w-[42px]"
              />
            </button>
          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
            <button
              type="button"
              className="flex h-12 shrink-0 items-center gap-2 rounded-[6px] bg-black-800 px-4 text-[14px] font-medium text-black-100"
            >
              <img src={calendarIcon} alt="" className="h-4 w-4 shrink-0" />
              <span>마감일</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCategories}
              className="flex h-12 shrink-0 items-center gap-2 rounded-[6px] bg-black-800 px-4 text-[14px] font-medium text-black-100"
            >
              {selectedCategoryPresentation ? (
                <CategoryIconBadge
                  icon={selectedCategoryPresentation.icon}
                  color={selectedCategoryPresentation.color}
                  size={16}
                  withBackground={false}
                />
              ) : (
                <img
                  src={categoryIcon}
                  alt=""
                  className="h-4 w-4 shrink-0"
                />
              )}
              <span>{selectedCategory?.categoryName ?? "카테고리"}</span>
            </button>

            <button
              type="button"
              className="flex h-12 shrink-0 items-center gap-2 rounded-[6px] bg-black-800 px-4 text-[14px] font-medium text-black-100"
            >
              <img src={alarmIcon} alt="" className="h-4 w-4 shrink-0" />
              <span>1일 전 알림</span>
            </button>
          </div>
      </section>

      {view === "category-list" && (
        <CategoryManagerSheet
          categories={categories}
          selectedCategoryId={selectedCategory?.categoryId ?? null}
          editable={editable}
          loading={loading}
          onBack={handleBackToComposer}
          onStartCreate={handleStartCreate}
          onToggleEdit={() => setEditable((current) => !current)}
          onSelect={handleSelectCategory}
          onStartUpdate={handleStartUpdate}
          onRequestDelete={setPendingDeleteCategory}
        />
      )}

      {view === "category-form" && (
        <CategoryFormSheet
          key={`${formMode}-${editingCategory?.categoryId ?? "new"}`}
          mode={formMode}
          initialName={editingCategory?.categoryName}
          initialColor={editingCategory?.color}
          initialIconKey={editingCategory?.iconKey}
          colors={availableColors}
          submitting={submitting}
          onBack={() => setView("category-list")}
          onSubmit={handleSubmitCategory}
        />
      )}

      <ConfirmModal
        open={pendingDeleteCategory !== null}
        title="태그를 삭제하시겠습니까?"
        isSubmitting={submitting}
        onCancel={() => setPendingDeleteCategory(null)}
        onConfirm={handleConfirmDelete}
      />

      {errorMessage && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[110] -translate-x-1/2 whitespace-nowrap rounded-[6px] border border-black-800 bg-black-850 px-4 py-2 text-[12px] font-medium text-black-200"
        >
          {errorMessage}
        </div>
      )}
    </>
  );
});
