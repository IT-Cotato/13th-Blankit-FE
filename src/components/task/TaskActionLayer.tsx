import type {
  Dispatch,
  RefObject,
  SetStateAction,
} from "react";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { TaskForm } from "@/components/task-create/TaskForm";
import type { TaskFormHandle } from "@/components/task-create/TaskForm";
import { TaskActionSheet } from "@/components/task/TaskActionSheet";

import type { TaskCreateRequest, TaskDetailResponse, TaskFormOptionsResponse, TaskUpdateRequest } from "@/types/taskApi";

interface TaskActionLayerProps {
  taskFormOptions:
    TaskFormOptionsResponse | null;
  aboveBottomNavigation: boolean;
  isComposerOpen: boolean;
  editingTask: TaskDetailResponse | null;
  taskTitle: string;
  taskFormRef: RefObject<
    TaskFormHandle | null
  >;
  onTitleChange: Dispatch<
    SetStateAction<string>
  >;
  onCloseComposer: () => void;
  onCompleteCreate: (
    request: TaskCreateRequest,
  ) => void | Promise<void>;
  onUpdateTask: (
    taskId: number,
    request: TaskUpdateRequest,
  ) => void | Promise<void>;
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
  taskFormRef,
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
        <TaskForm
          formOptions={taskFormOptions}
          key={
            editingTask?.taskId ?? "create"
          }
          ref={taskFormRef}
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
