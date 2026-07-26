import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Toast } from "@/components/common/Toast";
import { TaskComposerPanel } from "@/components/task-create/TaskComposerPanel";
import { AlarmSelectionSheet } from "@/components/task-create/alarm/AlarmSelectionSheet";
import { useAlarmFlow } from "@/components/task-create/alarm/useAlarmFlow";
import { CategoryFormSheet } from "@/components/task-create/category/CategoryFormSheet";
import { CategoryManagerSheet } from "@/components/task-create/category/CategoryManagerSheet";
import { useCategoryFlow } from "@/components/task-create/category/useCategoryFlow";
import { DateSelectionSheet } from "@/components/task-create/date/DateSelectionSheet";
import { formatDeadline } from "@/components/task-create/date/utils/calendar";
import { getFirstRepeatDate } from "@/components/task-create/date/utils/repeat";
import { useDateFlow } from "@/components/task-create/date/useDateFlow";
import { SimilarTaskSheet } from "@/components/task-create/similar-task/SimilarTaskSheet";
import { resolveTaskDeadline } from "@/components/task-create/taskCreateUtils";

import { mockTasks } from "@/mocks/tasks";
import type { Task } from "@/types/task";

export interface TaskCreateComposerHandle {
  focus: () => void;
}

interface TaskCreateComposerProps {
  title: string;
  task: Task | null;
  onTitleChange: (title: string) => void;
  onClose: () => void;
  onComplete: (similarTaskId: number | null) => void;
  onUpdate?: (task: Task) => void;
}

export const TaskCreateComposer = forwardRef<
  TaskCreateComposerHandle,
  TaskCreateComposerProps
>(function TaskCreateComposer(
  {
    title,
    task,
    onTitleChange,
    onClose,
    onComplete,
    onUpdate,
  },
  ref,
) {
  const [step, setStep] = useState<"composer" | "similar">("composer");
  const inputRef = useRef<HTMLInputElement>(null);

  function focusTaskInput() {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  const categoryFlow = useCategoryFlow({
    onReturnToComposer: focusTaskInput,
    initialCategory: task?.category,
  });
  const alarmFlow = useAlarmFlow({
    onReturnToComposer: focusTaskInput,
    initialAlarm: "1일 전",
  });
  const dateFlow = useDateFlow({
    onReturnToComposer: focusTaskInput,
    initialDate: task?.deadline
      ? new Date(`${task.deadline}T00:00:00`)
      : null,
  });
  const isComposerVisible =
    step === "composer" &&
    categoryFlow.view === "composer" &&
    alarmFlow.view === "composer" &&
    !dateFlow.open;
  const hasDeadline =
    dateFlow.selectedDate !== null ||
    dateFlow.repeatSettings !== null;
  const canContinue =
    title.trim().length > 0 &&
    hasDeadline &&
    categoryFlow.selectedCategory !== null;
  const firstRepeatDate = dateFlow.repeatSettings
    ? getFirstRepeatDate(dateFlow.repeatSettings)
    : null;
  const selectedDeadline = dateFlow.selectedDate ?? firstRepeatDate;
  const dateLabel = selectedDeadline
    ? formatDeadline(selectedDeadline)
    : dateFlow.repeatSettings
      ? "반복 설정"
      : "날짜 선택";

  function handleComplete(similarTaskId: number | null) {
    if (task && onUpdate) {
      onUpdate({
        ...task,
        title: title.trim(),
        category: categoryFlow.selectedCategory ?? task.category,
        deadline: resolveTaskDeadline({
          selectedDate: dateFlow.selectedDate,
          repeatSettings: dateFlow.repeatSettings,
          fallbackDeadline: task.deadline,
        }),
      });
      return;
    }

    onComplete(similarTaskId);
  }

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
  }));

  return (
    <>
      <button
        type="button"
        aria-label="과업 입력 닫기"
        onClick={onClose}
        className="fixed inset-0 z-[60] cursor-default bg-black/80"
      />

      <TaskComposerPanel
        visible={isComposerVisible}
        editing={task !== null}
        title={title}
        canContinue={canContinue}
        dateLabel={dateLabel}
        category={categoryFlow.selectedCategory}
        alarm={alarmFlow.selectedAlarm}
        inputRef={inputRef}
        onTitleChange={onTitleChange}
        onContinue={() => setStep("similar")}
        onOpenDate={dateFlow.openDateSheet}
        onOpenCategory={categoryFlow.openCategories}
        onOpenAlarm={alarmFlow.openAlarms}
      />

      {step === "similar" && (
        <SimilarTaskSheet
          tasks={mockTasks}
          onBack={() => {
            setStep("composer");
            focusTaskInput();
          }}
          onComplete={handleComplete}
        />
      )}

      {categoryFlow.view === "category-list" && (
        <CategoryManagerSheet
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
          initialName={categoryFlow.editingCategory?.categoryName}
          initialColor={categoryFlow.editingCategory?.color}
          initialIconKey={categoryFlow.editingCategory?.iconKey}
          colors={categoryFlow.availableColors}
          submitting={categoryFlow.submitting}
          onBack={categoryFlow.backToList}
          onSubmit={categoryFlow.submitCategory}
        />
      )}

      {alarmFlow.view === "alarm-list" && (
        <AlarmSelectionSheet
          selectedAlarm={alarmFlow.selectedAlarm}
          onSelect={alarmFlow.selectAlarm}
        />
      )}

      {dateFlow.open && (
        <DateSelectionSheet
          initialDate={dateFlow.selectedDate}
          initialRepeat={dateFlow.repeatSettings}
          onBack={dateFlow.closeDateSheet}
          onConfirm={dateFlow.confirmDate}
          onConfirmRepeat={dateFlow.confirmRepeat}
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
});
