export function shouldShowPlaylistTaskBar(
  pathname: string,
) {
  return (
    pathname === "/" ||
    pathname === "/calendar" ||
    pathname === "/mypage" ||
    pathname.startsWith("/task-combinations/")
  );
}
