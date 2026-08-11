import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { addPlaylistItems } from "@/api/playlist";
import { usePlaylistRefresh } from "@/hooks/usePlaylistRefresh";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { getRecommendedTaskIds } from "@/utils/homeRecommendedTask";

import type { RecommendedTaskItem } from "@/types/recommendationApi";

interface UseStartRecommendedTasksOptions {
  recommendedTasks: RecommendedTaskItem[];
  onShowToast: (message: string) => void;
}

export function useStartRecommendedTasks({
  recommendedTasks,
  onShowToast,
}: UseStartRecommendedTasksOptions) {
  const navigate = useNavigate();
  const playlistTaskCount = usePlaylistStore(
    (state) => state.playlist.length,
  );
  const { refreshPlaylist } = usePlaylistRefresh();
  const [
    isStartingRecommendedTasks,
    setIsStartingRecommendedTasks,
  ] = useState(false);
  const startInFlightRef = useRef(false);

  const startRecommendedTasks = useCallback(async () => {
    if (playlistTaskCount > 0) {
      navigate("/task-playlist");
      return;
    }

    if (startInFlightRef.current) {
      return;
    }

    const taskIds = getRecommendedTaskIds(
      recommendedTasks,
    );

    if (taskIds.length === 0) {
      onShowToast("추천 과업을 찾지 못했습니다.");
      return;
    }

    startInFlightRef.current = true;
    setIsStartingRecommendedTasks(true);
    let tasksAdded = false;

    try {
      await addPlaylistItems({
        taskIds,
        sourceMode: null,
      });
      tasksAdded = true;

      await refreshPlaylist();
      navigate("/task-playlist", {
        state: {
          playlistCreatedToastMessage:
            "지금 가장 필요한 과업들로\n사용자에게 딱 맞는 플레이리스트를 만들었어요.\n바로 시작해보세요!",
        },
      });
    } catch {
      onShowToast(
        tasksAdded
          ? "과업은 추가되었지만 재생 목록을 불러오지 못했습니다."
          : "추천 과업을 재생 목록에 추가하지 못했습니다.",
      );
    } finally {
      startInFlightRef.current = false;
      setIsStartingRecommendedTasks(false);
    }
  }, [
    navigate,
    onShowToast,
    playlistTaskCount,
    recommendedTasks,
    refreshPlaylist,
  ]);

  return {
    startRecommendedTasks,
    isStartingRecommendedTasks,
  };
}
