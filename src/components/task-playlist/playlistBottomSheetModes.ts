import { taskCombinations } from "@/mocks/taskCombinations";

import type { CombinationModeId } from "@/types/taskCombination";

export type PlaylistFilter = "all" | CombinationModeId;

export const PLAYLIST_FILTERS: Array<{
  id: PlaylistFilter;
  label: string;
}> = [
  { id: "all", label: "전체" },
  ...taskCombinations.map((combination) => ({
    id: combination.id,
    label: combination.name.replace(" 모드", ""),
  })),
];

export const ACTIVE_FILTER_CLASS_NAMES: Record<
  PlaylistFilter,
  string
> = {
  all: "bg-green-500 text-black-900",
  FIRE: "bg-red-500 text-black-900",
  BALANCE: "bg-green-600 text-black-900",
  TASTE: "bg-purple-500 text-black-900",
  CLEAR: "bg-[#FBF965] text-black-900",
};
