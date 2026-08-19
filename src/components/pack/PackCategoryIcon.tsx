import { CATEGORY_ICON_MAP } from "@/constants/category";
import type { CategoryIconKey } from "@/types/category";

interface PackCategoryIconProps {
  iconKey: CategoryIconKey;
}

export function PackCategoryIcon({ iconKey }: PackCategoryIconProps) {
  return (
    <div
      aria-label="과업 카테고리"
      className="flex aspect-square h-10 w-10 shrink-0 items-center justify-center gap-[10px] rounded-[100px] bg-[rgba(179,187,250,0.2)] p-[10px]"
    >
      <img
        src={CATEGORY_ICON_MAP[iconKey]}
        alt=""
        aria-hidden="true"
        className="h-5 w-5"
      />
    </div>
  );
}
