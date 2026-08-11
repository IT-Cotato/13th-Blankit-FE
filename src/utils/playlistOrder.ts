import type {
  PlaylistTask,
} from "@/types/taskCombination";
import type {
  UpdatePlaylistOrderRequest,
} from "@/types/playlistApi";

export function createPlaylistOrderRequest(
  playlist: PlaylistTask[],
): UpdatePlaylistOrderRequest {
  const items = playlist.map((task, index) => {
    if (typeof task.playlistItemId !== "number") {
      throw new Error(
        "플레이리스트 항목 ID가 없습니다.",
      );
    }

    return {
      playlistItemId: task.playlistItemId,
      sortOrder: index,
    };
  });

  return {
    items,
  };
}