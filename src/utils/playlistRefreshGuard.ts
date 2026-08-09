let latestPlaylistRefreshId = 0;

export function startPlaylistRefresh() {
  latestPlaylistRefreshId += 1;

  return latestPlaylistRefreshId;
}

export function canApplyPlaylistRefresh(
  requestId: number,
  requestedUserId: number,
  isAuthenticated: boolean,
  currentUserId: number | null,
) {
  return (
    requestId === latestPlaylistRefreshId &&
    isAuthenticated &&
    requestedUserId === currentUserId
  );
}
