import { useRef } from "react";
import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { updatePlaylistOrder } from "@/api/playlist";
import { usePlaylistRefresh } from "@/hooks/usePlaylistRefresh";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { createPlaylistOrderRequest } from "@/utils/playlistOrder";

import type { DragEndEvent } from "@dnd-kit/core";
import type { PlaylistTask } from "@/types/taskCombination";

interface UsePlaylistReorderOptions {
  playlist: PlaylistTask[];
  draggingAllowed: boolean;
  deletingSelectedTasks: boolean;
  showDeleteSelectedDialog: boolean;
  savingOrder: boolean;
  setSavingOrder: (saving: boolean) => void;
  onShowToast: (message: string) => void;
}

export function usePlaylistReorder({
  playlist,
  draggingAllowed,
  deletingSelectedTasks,
  showDeleteSelectedDialog,
  savingOrder,
  setSavingOrder,
  onShowToast,
}: UsePlaylistReorderOptions) {
  const reorderTask = usePlaylistStore(
    (state) => state.reorderTask,
  );
  const replacePlaylist = usePlaylistStore(
    (state) => state.replacePlaylist,
  );
  const { refreshPlaylist } = usePlaylistRefresh();

  const ignoreTaskClickRef = useRef(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    }),
  );

  const draggingDisabled =
    !draggingAllowed ||
    deletingSelectedTasks ||
    savingOrder ||
    showDeleteSelectedDialog;

  const releaseTaskClick = () => {
    window.setTimeout(() => {
      ignoreTaskClickRef.current = false;
    }, 0);
  };

  const handleDragStart = () => {
    if (draggingDisabled) {
      return;
    }

    ignoreTaskClickRef.current = true;
  };

  const handleDragCancel = () => {
    releaseTaskClick();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (
      draggingDisabled ||
      !over ||
      active.id === over.id
    ) {
      releaseTaskClick();
      return;
    }

    const previousPlaylist = [...playlist];

    reorderTask(String(active.id), String(over.id));

    const nextPlaylist = usePlaylistStore.getState().playlist;

    setSavingOrder(true);

    try {
      const payload = createPlaylistOrderRequest(nextPlaylist);

      await updatePlaylistOrder(payload);

      onShowToast(
        "재생 목록 순서가 변경되었습니다.",
      );
    } catch {
      try {
        await refreshPlaylist();
      } catch {
        replacePlaylist(previousPlaylist);
      }

      onShowToast(
        "재생 목록 순서 변경에 실패했습니다.",
      );
    } finally {
      setSavingOrder(false);
      releaseTaskClick();
    }
  };

  const consumeIgnoredTaskClick = () => {
    const ignored = ignoreTaskClickRef.current;
    ignoreTaskClickRef.current = false;

    return ignored;
  };

  return {
    sensors,
    draggingDisabled,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
    consumeIgnoredTaskClick,
  };
}
