import type {
  Dispatch,
  RefObject,
  SetStateAction,
} from "react";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { TaskCreateComposer } from "@/components/task-create/TaskCreateComposer";
import type { TaskCreateComposerHandle } from "@/components/task-create/TaskCreateComposer";
import { TaskActionSheet } from "@/components/task/TaskActionSheet";
import type { Task } from "@/types/task";

interface TaskActionLayerProps {
  aboveBottomNavigation: boolean;
  isComposerOpen: boolean;
  editingTask: Task | null;
  taskTitle: string;
  composerRef: RefObject<TaskCreateComposerHandle | null>;
  onTitleChange: Dispatch<SetStateAction<string>>;
  onCloseComposer: () => void;
  onCompleteCreate: () => void;
  onUpdateTask: (task: Task) => void;
  actionSheetOpen: boolean;
  onCloseActionSheet: () => void;
  onEditTask: () => void;
  onRequestDelete: () => void;
  deleteModalOpen: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export function TaskActionLayer({
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
  onCancelDelete,
  onConfirmDelete,
}: TaskActionLayerProps) {
  return (
    <>
      {isComposerOpen && (
        <TaskCreateComposer
          key={editingTask?.taskId ?? "create"}
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
        aboveBottomNavigation={aboveBottomNavigation}
        onClose={onCloseActionSheet}
        onEdit={onEditTask}
        onDelete={onRequestDelete}
      />

      <ConfirmModal
        open={deleteModalOpen}
        title="과업을 진짜 삭제하시겠습니까?"
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}
