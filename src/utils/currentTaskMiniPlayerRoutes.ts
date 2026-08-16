export function shouldShowCurrentTaskMiniPlayer(
  pathname: string,
) {
  return (
    pathname === "/" ||
    pathname.startsWith("/task-combinations/")
  );
}
