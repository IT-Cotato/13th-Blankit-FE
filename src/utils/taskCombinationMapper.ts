import balanceModeIcon from "@/assets/icons/task-combination/balance-mode.svg";
import fireModeIcon from "@/assets/icons/task-combination/fire-mode.svg";
import getItDoneModeIcon from "@/assets/icons/task-combination/get-it-done-mode.svg";
import quickTryModeIcon from "@/assets/icons/task-combination/quick-try-mode.svg";
import { CATEGORY_ICON_MAP } from "@/constants/category";

import type {
  CategoryIconKey,
} from "@/types/category";
import type {
  RecommendationModeItemResponse,
  RecommendationModesResponse,
} from "@/types/recommendationApi";
import type {
  CombinationAccent,
  CombinationModeId,
  TaskCombination,
} from "@/types/taskCombination";

interface CombinationModePresentation {
  accent: CombinationAccent;
  icon: string;
}

const COMBINATION_MODE_PRIORITY: CombinationModeId[] = [
  "FIRE",
  "BALANCE",
  "TASTE",
  "CLEAR",
];

const COMBINATION_MODE_PRESENTATIONS: Record<
  CombinationModeId,
  CombinationModePresentation
> = {
  FIRE: {
    accent: "red",
    icon: fireModeIcon,
  },
  BALANCE: {
    accent: "green",
    icon: balanceModeIcon,
  },
  TASTE: {
    accent: "purple",
    icon: quickTryModeIcon,
  },
  CLEAR: {
    accent: "orange",
    icon: getItDoneModeIcon,
  },
};

function isCombinationModeId(
  mode: string,
): mode is CombinationModeId {
  return mode in COMBINATION_MODE_PRESENTATIONS;
}

function getCategoryIconKey(
  categoryIconKey: string,
): CategoryIconKey {
  if (categoryIconKey in CATEGORY_ICON_MAP) {
    return categoryIconKey as CategoryIconKey;
  }

  return "goal";
}

function getCombinationModeName(modeName: string) {
  const trimmedModeName = modeName.trim();

  return trimmedModeName.endsWith("모드")
    ? trimmedModeName
    : `${trimmedModeName} 모드`;
}

function mapRecommendationMode(
  modeResponse: RecommendationModeItemResponse,
): TaskCombination | null {
  if (!isCombinationModeId(modeResponse.mode)) {
    return null;
  }

  const modePresentation =
    COMBINATION_MODE_PRESENTATIONS[modeResponse.mode];

  return {
    id: modeResponse.mode,
    name: getCombinationModeName(modeResponse.modeName),
    description: modeResponse.description,
    icon: modePresentation.icon,
    accent: modePresentation.accent,
    tasks: modeResponse.tasks.map((task) => {
      const categoryIconKey = getCategoryIconKey(
        task.categoryIconKey,
      );
      const progressRate = task.progressRate ?? 0;

      return {
        id: String(task.taskId),
        taskId: task.taskId,
        title: task.title,
        memo: task.memo,
        priority: task.priority,
        status:
          progressRate > 0 ? "IN_PROGRESS" : "TODO",
        progressRate,
        estimatedMinutes: task.recommendedMinutes,
        categoryId: `${task.categoryColor}-${categoryIconKey}`,
        categoryName: "",
        categoryIcon:
          CATEGORY_ICON_MAP[categoryIconKey],
        category: {
          categoryId: task.taskId,
          categoryName: "",
          color: task.categoryColor,
          iconKey: categoryIconKey,
        },
      };
    }),
  };
}

export function mapRecommendationModes(
  response: RecommendationModesResponse,
) {
  return mapRecommendationModesWithVisibility(response)
    .combinations;
}

export function mapRecommendationModesWithVisibility(
  response: RecommendationModesResponse,
) {
  const combinations = response.modes
    .flatMap((modeResponse) => {
      const combination = mapRecommendationMode(modeResponse);

      return combination ? [combination] : [];
    })
    .sort(
      (first, second) =>
        COMBINATION_MODE_PRIORITY.indexOf(first.id) -
        COMBINATION_MODE_PRIORITY.indexOf(second.id),
    );

  const visibleCombinations: TaskCombination[] = [];
  const hiddenDuplicateModeIds: CombinationModeId[] = [];
  const seenTaskCombinations = new Set<string>();

  combinations.forEach((combination) => {
    if (combination.tasks.length === 0) {
      return;
    }

    const taskCombinationKey = [
      ...new Set(
        combination.tasks.map((task) => task.taskId),
      ),
    ]
      .sort((first, second) => first - second)
      .join(",");

    if (seenTaskCombinations.has(taskCombinationKey)) {
      hiddenDuplicateModeIds.push(combination.id);
      return;
    }

    seenTaskCombinations.add(taskCombinationKey);
    visibleCombinations.push(combination);
  });

  return {
    combinations: visibleCombinations,
    hiddenDuplicateModeIds,
  };
}
