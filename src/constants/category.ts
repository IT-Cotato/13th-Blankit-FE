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

export const CATEGORY_ICON_MAP: Record<
  CategoryIconKey,
  string
> = {
  alarm: ctgy1Icon,
  note: ctgy2Icon,
  work: ctgy3Icon,
  daily: ctgy4Icon,
  calendar: ctgy5Icon,
  checklist: ctgy6Icon,
  hobby: ctgy7Icon,
  study: ctgy8Icon,
  book: ctgy9Icon,
  exercise: ctgy10Icon,
  housework: ctgy11Icon,
  goal: ctgy12Icon,
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
