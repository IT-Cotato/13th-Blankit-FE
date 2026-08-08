interface DockedTaskTimeBarVisibility {
  hasCurrentPlaylistTask: boolean;
  isCardVisible: boolean;
  hasPassedTopBar: boolean;
}

export function shouldShowDockedTaskTimeBar({
  hasCurrentPlaylistTask,
  isCardVisible,
  hasPassedTopBar,
}: DockedTaskTimeBarVisibility) {
  return (
    !hasCurrentPlaylistTask &&
    !isCardVisible &&
    hasPassedTopBar
  );
}
