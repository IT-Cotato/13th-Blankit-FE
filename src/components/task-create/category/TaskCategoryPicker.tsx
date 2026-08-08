import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Toast } from "@/components/common/Toast";

import { CategoryFormSheet } from "./CategoryFormSheet";
import { CategoryListSheet } from "./CategoryListSheet";

import type { CategoryFlow } from "./useCategoryFlow";

interface TaskCategoryPickerProps {
  categoryFlow: CategoryFlow;
}

export function TaskCategoryPicker({
  categoryFlow,
}: TaskCategoryPickerProps) {
  return (
    <>
      {categoryFlow.view === "category-list" && (
        <CategoryListSheet
          categories={categoryFlow.categories}
          selectedCategoryId={
            categoryFlow.selectedCategory?.categoryId ?? null
          }
          editable={categoryFlow.editable}
          loading={categoryFlow.loading}
          onBack={categoryFlow.backToComposer}
          onStartCreate={categoryFlow.startCreate}
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
            categoryFlow.editingCategory?.categoryName
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
    </>
  );
}
