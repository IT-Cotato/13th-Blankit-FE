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

interface TaskCombinationCategory {
  id: string;
  icon: string;
}

export function getCombinationAccentClassName(
  accent: CombinationAccent,
) {
  return ACCENT_CLASS_NAMES[accent];
}

export function getUniqueTaskCombinationCategories(
  tasks: CombinationTask[],
  limit = 3,
): TaskCombinationCategory[] {
  if (limit <= 0) {
    return [];
  }

  const seenCategoryIds = new Set<string>();
  const categories: TaskCombinationCategory[] = [];

  for (const task of tasks) {
    if (seenCategoryIds.has(task.categoryId)) {
      continue;
    }

    seenCategoryIds.add(task.categoryId);
    categories.push({
      id: task.categoryId,
      icon: task.categoryIcon,
    });

    if (categories.length >= limit) {
      break;
    }
  }

  return categories;
}
