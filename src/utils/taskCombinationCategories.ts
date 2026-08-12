import type {
  CombinationAccent,
  CombinationTask,
} from "@/types/taskCombination";

const ACCENT_CLASS_NAMES: Record<
  CombinationAccent,
  string
> = {
  red: "bg-red-800",
  green: "bg-green-800",
  purple: "bg-purple-800",
  orange: "bg-orange-800",
};

interface TaskCombinationCategoryIcon {
  id: string;
  icon: string;
}

export function getCombinationAccentClassName(
  accent: CombinationAccent,
) {
  return ACCENT_CLASS_NAMES[accent];
}

export function getTaskCombinationCategoryIcons(
  tasks: CombinationTask[],
  limit = 3,
): TaskCombinationCategoryIcon[] {
  if (limit <= 0) {
    return [];
  }

  return tasks.slice(0, limit).map((task) => ({
    id: task.id,
    icon: task.categoryIcon,
  }));
}
