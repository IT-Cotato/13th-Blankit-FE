import { CATEGORY_ICON_MAP } from "@/constants/category";
import type { CategoryIconKey } from "@/types/category";

interface PackCategoryIconProps {
  iconKey: CategoryIconKey;
  categoryName?: string;
}

export function PackCategoryIcon({
  iconKey,
  categoryName,
}: PackCategoryIconProps) {
  return (
    <div
      aria-label={categoryName ? `${categoryName} 카테고리` : "과업 카테고리"}
      className="flex aspect-square h-10 w-10 shrink-0 items-center justify-center gap-[10px] rounded-[100px] bg-[rgba(179,187,250,0.2)] p-[10px]"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 bg-purple-500"
        style={{
          maskImage: `url("${CATEGORY_ICON_MAP[iconKey]}")`,
          WebkitMaskImage: `url("${CATEGORY_ICON_MAP[iconKey]}")`,
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
    </div>
  );
}
