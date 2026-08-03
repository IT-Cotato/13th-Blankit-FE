import ctgy1Icon from "@/assets/icons/category/ctgy-1.svg";
import ctgy2Icon from "@/assets/icons/category/ctgy-2.svg";
import ctgy3Icon from "@/assets/icons/category/ctgy-3.svg";
import ctgy4Icon from "@/assets/icons/category/ctgy-4.svg";
import ctgy5Icon from "@/assets/icons/category/ctgy-5.svg";
import ctgy6Icon from "@/assets/icons/category/ctgy-6.svg";
import ctgy7Icon from "@/assets/icons/category/ctgy-7.svg";
import ctgy8Icon from "@/assets/icons/category/ctgy-8.svg";
import ctgy9Icon from "@/assets/icons/category/ctgy-9.svg";
import ctgy10Icon from "@/assets/icons/category/ctgy-10.svg";
import ctgy11Icon from "@/assets/icons/category/ctgy-11.svg";
import ctgy12Icon from "@/assets/icons/category/ctgy-12.svg";

import type {
  Category,
  CategoryIconKey,
} from "@/types/category";

export const CATEGORY_ICON_MAP: Record<CategoryIconKey, string> = {
  "ctgy-1": ctgy1Icon,
  "ctgy-2": ctgy2Icon,
  "ctgy-3": ctgy3Icon,
  "ctgy-4": ctgy4Icon,
  "ctgy-5": ctgy5Icon,
  "ctgy-6": ctgy6Icon,
  "ctgy-7": ctgy7Icon,
  "ctgy-8": ctgy8Icon,
  "ctgy-9": ctgy9Icon,
  "ctgy-10": ctgy10Icon,
  "ctgy-11": ctgy11Icon,
  "ctgy-12": ctgy12Icon,
};

export const CATEGORY_ICON_OPTIONS = (
  Object.entries(CATEGORY_ICON_MAP) as [CategoryIconKey, string][]
).map(([key, icon]) => ({ key, icon }));

export const CATEGORY_COLORS: readonly string[] = [
  "#FC5F5F",
  "#FF9A33",
  "#FBF965",
  "#D3FB65",
  "#5BE478",
  "#5BE4CB",
  "#6FD4FF",
  "#B3BBFA",
  "#F2B3FA",
  "#C5C9CD",
];

export interface CategoryPresentation {
  color: string;
  iconKey: CategoryIconKey;
  icon: string;
}

export function getCategoryPresentation(
  category: Category,
): CategoryPresentation {
  return {
    color: category.color,
    iconKey: category.iconKey,
    icon: CATEGORY_ICON_MAP[category.iconKey],
  };
}
