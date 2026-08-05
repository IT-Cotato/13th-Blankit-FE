import { CATEGORY_COLORS } from "@/constants/category";
import { mockTasks } from "@/mocks/tasks";

import type {
  Category,
  CategoryMutationRequest,
} from "@/types/category";

const INITIAL_CATEGORIES: Category[] = [
  {
    categoryId: 1,
    categoryName: "학업",
    color: "#FC5F5F",
    iconKey: "study",
  },
  {
    categoryId: 2,
    categoryName: "일상",
    color: "#FF9A33",
    iconKey: "housework",
  },
  {
    categoryId: 3,
    categoryName: "기념일",
    color: "#D3FB65",
    iconKey: "pin",
  },
];

let categories = [...INITIAL_CATEGORIES];

function delay(milliseconds = 250) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export async function getMockCategories() {
  await delay();
  return [...categories];
}

export async function getMockAvailableColors(
  editingCategoryId?: number,
) {
  await delay();

  const editingCategory = categories.find(
    (category) => category.categoryId === editingCategoryId,
  );
  const usedColors = new Set(
    categories
      .filter((category) => category.categoryId !== editingCategoryId)
      .map((category) => category.color),
  );
  const availableColors = CATEGORY_COLORS.filter(
    (color) => !usedColors.has(color),
  );

  if (
    editingCategory &&
    !availableColors.includes(editingCategory.color)
  ) {
    return [editingCategory.color, ...availableColors];
  }

  return availableColors;
}

export async function createMockCategory(
  values: CategoryMutationRequest,
) {
  await delay();

  if (categories.length >= CATEGORY_COLORS.length) {
    throw new Error("카테고리는 최대 10개까지 만들 수 있어요.");
  }

  if (categories.some((category) => category.color === values.color)) {
    throw new Error("이미 사용 중인 색상입니다.");
  }

  const created: Category = {
    categoryId:
      Math.max(0, ...categories.map((category) => category.categoryId)) + 1,
    categoryName: values.name,
    color: values.color,
    iconKey: values.iconKey,
  };

  categories = [...categories, created];
  return created;
}

export async function updateMockCategory(
  categoryId: number,
  values: CategoryMutationRequest,
) {
  await delay();

  const existing = categories.find(
    (category) => category.categoryId === categoryId,
  );

  if (!existing) {
    throw new Error("카테고리를 찾을 수 없습니다.");
  }

  if (
    categories.some(
      (category) =>
        category.categoryId !== categoryId &&
        category.color === values.color,
    )
  ) {
    throw new Error("이미 사용 중인 색상입니다.");
  }

  const updated: Category = {
    ...existing,
    categoryName: values.name,
    color: values.color,
    iconKey: values.iconKey,
  };

  categories = categories.map((category) =>
    category.categoryId === categoryId ? updated : category,
  );

  return updated;
}

export async function deleteMockCategory(categoryId: number) {
  await delay();

  const hasTask = mockTasks.some(
    (task) => task.category.categoryId === categoryId,
  );

  if (hasTask) {
    throw new Error("과업이 포함된 카테고리는 삭제할 수 없어요.");
  }

  categories = categories.filter(
    (category) => category.categoryId !== categoryId,
  );
}
