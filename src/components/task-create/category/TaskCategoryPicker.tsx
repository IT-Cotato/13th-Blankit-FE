import { useEffect, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Toast } from "@/components/common/Toast";

import { CategoryFormSheet } from "./CategoryFormSheet";
import { CategoryListSheet } from "./CategoryListSheet";
import { getCategoryFormInitialName } from "./categoryDraft";

import type { CategoryFlow } from "./useCategoryFlow";

interface TaskCategoryPickerProps {
  categoryFlow: CategoryFlow;
}

export function TaskCategoryPicker({
  categoryFlow,
}: TaskCategoryPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef =
    useRef<HTMLElement | null>(null);
  const open = categoryFlow.view !== "composer";

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    return () => {
      previouslyFocusedElementRef.current?.focus();
      previouslyFocusedElementRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      const firstFocusableElement =
        containerRef.current?.querySelector<HTMLElement>(
          "[data-autofocus]",
        ) ??
        containerRef.current?.querySelector<HTMLElement>(
          "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );

      firstFocusableElement?.focus();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [categoryFlow.view, open]);

  function handleKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) {
    if (
      event.key !== "Tab" ||
      categoryFlow.pendingDeleteCategory !== null
    ) {
      return;
    }

    const focusableElements =
      containerRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      );

    if (!focusableElements?.length) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement =
      focusableElements[focusableElements.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === firstElement
    ) {
      event.preventDefault();
      lastElement.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {categoryFlow.view === "category-list" && (
        <CategoryListSheet
          categories={categoryFlow.categories}
          selectedCategoryId={
            categoryFlow.selectedCategory?.categoryId ?? null
          }
          editable={categoryFlow.editable}
          loading={categoryFlow.loading}
          draftCategoryName={categoryFlow.draftCategoryName}
          onBack={categoryFlow.backToComposer}
          onStartCreate={categoryFlow.startCreate}
          onDraftCategoryNameChange={categoryFlow.setDraftCategoryName}
          onToggleEdit={categoryFlow.toggleEditable}
          onSelect={categoryFlow.selectCategory}
          onStartUpdate={categoryFlow.startUpdate}
          onRequestDelete={categoryFlow.requestDelete}
        />
      )}

      {categoryFlow.view === "category-form" && (
        <CategoryFormSheet
          key={`${categoryFlow.formMode}-${
            categoryFlow.editingCategory?.categoryId ?? "new"
          }`}
          mode={categoryFlow.formMode}
          initialName={
            getCategoryFormInitialName(
              categoryFlow.formMode,
              categoryFlow.editingCategory?.categoryName,
              categoryFlow.draftCategoryName,
            )
          }
          initialColor={categoryFlow.editingCategory?.color}
          initialIconKey={
            categoryFlow.editingCategory?.iconKey
          }
          colors={categoryFlow.availableColors}
          submitting={categoryFlow.submitting}
          onBack={categoryFlow.backToList}
          onSubmit={categoryFlow.submitCategory}
        />
      )}

      <ConfirmModal
        open={categoryFlow.pendingDeleteCategory !== null}
        title="카테고리를 삭제하시겠습니까?"
        confirmLabel="삭제"
        submitting={categoryFlow.submitting}
        onCancel={categoryFlow.cancelDelete}
        onConfirm={categoryFlow.confirmDelete}
      />

      <Toast message={categoryFlow.errorMessage} />
    </div>
  );
}
