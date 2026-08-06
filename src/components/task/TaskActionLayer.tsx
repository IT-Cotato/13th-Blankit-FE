import type {
  Dispatch,
  RefObject,
  SetStateAction,
} from "react";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { TaskComposerFlow } from "@/components/task-create/TaskComposerFlow";
import type { TaskComposerFlowHandle } from "@/components/task-create/TaskComposerFlow";
import { TaskActionSheet } from "@/components/task/TaskActionSheet";

import type { Task } from "@/types/task";
import type { TaskCreateRequest, TaskDetailResponse, TaskFormOptionsResponse } from "@/types/taskApi";

interface TaskActionLayerProps {
  taskFormOptions:
    TaskFormOptionsResponse | null;
  aboveBottomNavigation: boolean;
  isComposerOpen: boolean;
  editingTask: TaskDetailResponse | null;
  taskTitle: string;
  composerRef: RefObject<
    TaskComposerFlowHandle | null
  >;
  onTitleChange: Dispatch<
    SetStateAction<string>
  >;
  onCloseComposer: () => void;
  onCompleteCreate: (
    request: TaskCreateRequest,
  ) => void | Promise<void>;
  onUpdateTask: (
    task: Pick<
      Task,
      | "taskId"
      | "title"
      | "category"
      | "deadline"
    >,
  ) => void;
  actionSheetOpen: boolean;
  onCloseActionSheet: () => void;
  onEditTask: () => void;
  onRequestDelete: () => void;
  deleteModalOpen: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void | Promise<void>;
  deletingTask: boolean;
}

export function TaskActionLayer({
  taskFormOptions,
  aboveBottomNavigation,
  isComposerOpen,
  editingTask,
  taskTitle,
  composerRef,
  onTitleChange,
  onCloseComposer,
  onCompleteCreate,
  onUpdateTask,
  actionSheetOpen,
  onCloseActionSheet,
  onEditTask,
  onRequestDelete,
  deleteModalOpen,
  deletingTask,
  onCancelDelete,
  onConfirmDelete,
}: TaskActionLayerProps) {
  return (
    <>
      {isComposerOpen && (
        <TaskComposerFlow
          formOptions={taskFormOptions}
          key={
            editingTask?.taskId ?? "create"
          }
          ref={composerRef}
          title={taskTitle}
          task={editingTask}
          onTitleChange={onTitleChange}
          onClose={onCloseComposer}
          onComplete={onCompleteCreate}
          onUpdate={onUpdateTask}
        />
      )}

      <TaskActionSheet
        open={actionSheetOpen}
        aboveBottomNavigation={
          aboveBottomNavigation
        }
        onClose={onCloseActionSheet}
        onEdit={onEditTask}
        onDelete={onRequestDelete}
      />

      <ConfirmModal
        open={deleteModalOpen}
        title="과업을 진짜 삭제하시겠습니까?"
        confirmLabel="삭제"
        submitting={deletingTask}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}