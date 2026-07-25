import playIcon from "@/assets/icons/task-combination/play.svg";

interface TaskTimerToggleIconProps {
  isPlaying: boolean;
}

export function TaskTimerToggleIcon({
  isPlaying,
}: TaskTimerToggleIconProps) {
  if (!isPlaying) {
    return (
      <img
        src={playIcon}
        alt=""
        className="h-[19px] w-[13px]"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex items-center gap-1"
    >
      <span className="h-5 w-[4px] rounded-full bg-black-600" />
      <span className="h-5 w-[4px] rounded-full bg-black-600" />
    </span>
  );
}
