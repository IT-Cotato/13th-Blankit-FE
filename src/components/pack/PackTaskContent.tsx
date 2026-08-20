import type { CategoryIconKey } from "@/types/category";

import { PackCategoryIcon } from "./PackCategoryIcon";
import { PackPlayButton } from "./PackPlayButton";
import { PackTaskProgressDetail } from "./PackTaskProgressDetail";
import { PackTaskTitle } from "./PackTaskTitle";

interface PackTaskContentProps {
  categoryIconKey: CategoryIconKey;
  title: string;
  progressDetail: string;
  onPlay?: () => void;
}

export function PackTaskContent({
  categoryIconKey,
  title,
  progressDetail,
  onPlay,
}: PackTaskContentProps) {
  return (
    <div className="flex h-[152px] w-[123px] flex-col items-center">
      <PackCategoryIcon iconKey={categoryIconKey} />
      <PackTaskTitle title={title} />
      <PackTaskProgressDetail detail={progressDetail} />
      <PackPlayButton onClick={onPlay} />
    </div>
  );
}
