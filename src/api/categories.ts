import {
  createMockCategory,
  deleteMockCategory,
  getMockAvailableColors,
  getMockCategories,
  updateMockCategory,
} from "@/mocks/categories";

import type {
  ApiResponse,
  Category,
  CategoryIconKey,
  CategoryMutationRequest,
} from "@/types/category";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("백엔드 API 연결을 확인해주세요.");
  }

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(body.message || "요청을 처리하지 못했습니다.");
  }

  return body.data;
}

export function getCategories() {
  if (USE_MOCK_API) {
    return getMockCategories();
  }

  return request<Category[]>("/api/categories");
}

export function getAvailableCategoryColors(
  editingCategoryId?: number,
) {
  if (USE_MOCK_API) {
    return getMockAvailableColors(editingCategoryId);
  }

  const query =
    editingCategoryId === undefined
      ? ""
      : `?editingCategoryId=${editingCategoryId}`;

  return request<string[]>(
    `/api/categories/available-colors${query}`,
  );
}

export function createCategory(
  values: CategoryMutationRequest,
  iconKey?: CategoryIconKey,
) {
  if (USE_MOCK_API) {
    return createMockCategory(values, iconKey);
  }

  return request<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify(values),
  });
}

export function updateCategory(
  categoryId: number,
  values: CategoryMutationRequest,
  iconKey?: CategoryIconKey,
) {
  if (USE_MOCK_API) {
    return updateMockCategory(categoryId, values, iconKey);
  }

  return request<Category>(`/api/categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  });
}

export async function deleteCategory(categoryId: number) {
  if (USE_MOCK_API) {
    await deleteMockCategory(categoryId);
    return;
  }

  await request<string>(`/api/categories/${categoryId}`, {
    method: "DELETE",
  });
}
