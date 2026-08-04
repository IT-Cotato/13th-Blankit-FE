import type { PlaylistTask } from "../types/taskCombination";

export function hasCurrentPlaylistTaskChanged(
  previousPlaylist: PlaylistTask[],
  nextPlaylist: PlaylistTask[],
) {
  return previousPlaylist[0]?.id !== nextPlaylist[0]?.id;
}

export function selectPlaylistTask(
  playlist: PlaylistTask[],
  taskId: string,
) {
  const selectedIndex = playlist.findIndex(
    (task) => task.id === taskId,
  );

  if (selectedIndex <= 0) {
    return playlist;
  }

  const nextPlaylist = [...playlist];
  const [selectedTask] = nextPlaylist.splice(selectedIndex, 1);

  return [selectedTask, ...nextPlaylist];
}
