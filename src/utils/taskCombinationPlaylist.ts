import type {
  CombinationModeId,
  PlaylistTask,
} from "@/types/taskCombination";

export interface CombinationPlaylistItem {
  taskId: string;
  playlistItemId: number;
}

export function getCombinationPlaylistItems(
  playlist: PlaylistTask[],
  modeId: CombinationModeId,
) {
  return playlist.flatMap((task) =>
    task.sourceMode === modeId &&
    typeof task.playlistItemId === "number"
      ? [
          {
            taskId: task.id,
            playlistItemId: task.playlistItemId,
          },
        ]
      : [],
  );
}
