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
import type { AlarmOption } from "@/components/task-create/alarm/alarmOptions";
import { useAlarmFlow } from "@/components/task-create/alarm/useAlarmFlow";
import { CategoryFormSheet } from "@/components/task-create/category/CategoryFormSheet";
import { CategoryManagerSheet } from "@/components/task-create/category/CategoryManagerSheet";
import { useCategoryFlow } from "@/components/task-create/category/useCategoryFlow";
import { DateSelectionSheet } from "@/components/task-create/date/DateSelectionSheet";
import { formatDeadline } from "@/components/task-create/date/utils/calendar";
import { getFirstRepeatDate } from "@/components/task-create/date/utils/repeat";
import { useDateFlow } from "@/components/task-create/date/useDateFlow";
import { SimilarTaskSheet } from "@/components/task-create/similar-task/SimilarTaskSheet";
import { useTaskSubmission } from "@/components/task-create/hooks/useTaskSubmission";
import { reminderOffsetToAlarmOption } from "@/components/task-create/utils/reminderMappers";
import { repeatRuleResponseToSettings } from "@/components/task-create/utils/repeatRuleMappers";

import type { TaskCreateRequest, TaskDetailResponse, TaskFormOptionsResponse, TaskUpdateRequest } from "@/types/taskApi";

export interface TaskComposerFlowHandle {
  focus: () => void;
}

interface TaskComposerFlowProps {
  formOptions:
    TaskFormOptionsResponse | null;
  title: string;
  task: TaskDetailResponse | null;
  onTitleChange: (title: string) => void;
  onClose: () => void;
  onComplete: (
    request: TaskCreateRequest,
  ) => void | Promise<void>;
  onUpdate?: (
    taskId: number,
    request: TaskUpdateRequest,
  ) => void | Promise<void>;
}

export const TaskComposerFlow = forwardRef<
  TaskComposerFlowHandle,
  TaskComposerFlowProps
>(function TaskComposerFlow(
  {
    formOptions,
    title,
    task,
    onTitleChange,
    onClose,
    onComplete,
    onUpdate,
  },
  ref,
) {
  const [step, setStep] = useState<
    "composer" | "similar"
  >("composer");

  const inputRef =
    useRef<HTMLInputElement>(null);

  function focusTaskInput() {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  const initialAlarm: AlarmOption =
    task
      ? reminderOffsetToAlarmOption(
          task.notificationSetting
            .notifyBefore,
        )
      : formOptions
        ? reminderOffsetToAlarmOption(
            formOptions
              .defaultReminderOffsetMinutes,
          )
        : "1일 전";

  const reminderOptions: AlarmOption[] =
    formOptions?.reminderOptions.map(
      reminderOffsetToAlarmOption,
    ) ?? [
      "1일 전",
      "3일 전",
      "일주일 전",
    ];

  const categoryFlow = useCategoryFlow({
    onReturnToComposer: focusTaskInput,
    initialCategory: task?.category ?? null,
    initialCategories: formOptions?.categories ?? []
  });

  const alarmFlow = useAlarmFlow({
    onReturnToComposer: focusTaskInput,
    initialAlarm,
  });

  const initialRepeatSettings =
    task?.repeatRule
      ? repeatRuleResponseToSettings(
          task.repeatRule,
        )
      : null;

  const dateFlow = useDateFlow({
    onReturnToComposer: focusTaskInput,

    initialDate:
      task && !task.repeatRule
        ? new Date(
            `${task.deadline}T00:00:00`,
          )
        : null,

    initialRepeat:
      initialRepeatSettings,
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

  const firstRepeatDate =
    dateFlow.repeatSettings
      ? getFirstRepeatDate(
          dateFlow.repeatSettings,
        )
      : null;

  const selectedDeadline =
    dateFlow.selectedDate ??
    firstRepeatDate;

  const dateLabel = selectedDeadline
    ? formatDeadline(selectedDeadline)
    : dateFlow.repeatSettings
      ? "반복 설정"
      : "날짜 선택";

  const { submitting, submitTask } =
    useTaskSubmission({
      title,
      task,
      selectedDate: dateFlow.selectedDate,
      repeatSettings: dateFlow.repeatSettings,
      selectedCategory:
        categoryFlow.selectedCategory,
      selectedAlarm:
        alarmFlow.selectedAlarm,
      onCreate: onComplete,
      onUpdate,
    });

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
        category={
          categoryFlow.selectedCategory
        }
        alarm={alarmFlow.selectedAlarm}
        inputRef={inputRef}
        onTitleChange={onTitleChange}
        onContinue={() =>
          setStep("similar")
        }
        onOpenDate={
          dateFlow.openDateSheet
        }
        onOpenCategory={
          categoryFlow.openCategories
        }
        onOpenAlarm={
          alarmFlow.openAlarms
        }
      />

      {step === "similar" && (
        <SimilarTaskSheet
          categories={categoryFlow.categories}
          submitting={submitting}
          onBack={() => {
            setStep("composer");
            focusTaskInput();
          }}
          onComplete={submitTask}
        />
      )}

      {categoryFlow.view ===
        "category-list" && (
        <CategoryManagerSheet
          categories={
            categoryFlow.categories
          }
          selectedCategoryId={
            categoryFlow.selectedCategory
              ?.categoryId ?? null
          }
          editable={categoryFlow.editable}
          loading={categoryFlow.loading}
          onBack={
            categoryFlow.backToComposer
          }
          onStartCreate={
            categoryFlow.startCreate
          }
          onToggleEdit={
            categoryFlow.toggleEditable
          }
          onSelect={
            categoryFlow.selectCategory
          }
          onStartUpdate={
            categoryFlow.startUpdate
          }
          onRequestDelete={
            categoryFlow.requestDelete
          }
        />
      )}

      {categoryFlow.view ===
        "category-form" && (
        <CategoryFormSheet
          key={`${categoryFlow.formMode}-${
            categoryFlow.editingCategory
              ?.categoryId ?? "new"
          }`}
          mode={categoryFlow.formMode}
          initialName={
            categoryFlow.editingCategory
              ?.categoryName
          }
          initialColor={
            categoryFlow.editingCategory
              ?.color
          }
          initialIconKey={
            categoryFlow.editingCategory
              ?.iconKey
          }
          colors={
            categoryFlow.availableColors
          }
          submitting={
            categoryFlow.submitting
          }
          onBack={
            categoryFlow.backToList
          }
          onSubmit={
            categoryFlow.submitCategory
          }
        />
      )}

      {alarmFlow.view ===
        "alarm-list" && (
        <AlarmSelectionSheet
          options={reminderOptions}
          selectedAlarm={
            alarmFlow.selectedAlarm
          }
          onSelect={
            alarmFlow.selectAlarm
          }
          onClose={
            alarmFlow.closeAlarms
          }
        />
      )}

      {dateFlow.open && (
        <DateSelectionSheet
          initialDate={
            dateFlow.selectedDate
          }
          initialRepeat={
            dateFlow.repeatSettings
          }
          onBack={
            dateFlow.closeDateSheet
          }
          onConfirm={
            dateFlow.confirmDate
          }
          onConfirmRepeat={
            dateFlow.confirmRepeat
          }
        />
      )}

      <ConfirmModal
        open={
          categoryFlow
            .pendingDeleteCategory !== null
        }
        title="카테고리를 삭제하시겠습니까?"
        confirmLabel="삭제"
        submitting={
          categoryFlow.submitting
        }
        onCancel={
          categoryFlow.cancelDelete
        }
        onConfirm={
          categoryFlow.confirmDelete
        }
      />

      <Toast
        message={
          categoryFlow.errorMessage
        }
      />
    </>
  );
});
