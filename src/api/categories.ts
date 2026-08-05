import { apiClient } from "@/api/client";

import type { ApiEnvelope } from "@/types/auth";
import type {
  Category,
  CategoryMutationRequest,
} from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  const response =
    await apiClient.get<ApiEnvelope<Category[]>>(
      "/api/categories",
    );

  return response.data.data;
}

export async function getAvailableCategoryColors(
  editingCategoryId?: number,
): Promise<string[]> {
  const response =
    await apiClient.get<ApiEnvelope<string[]>>(
      "/api/categories/available-colors",
      {
        params:
          editingCategoryId === undefined
            ? undefined
            : { editingCategoryId },
      },
    );

  return response.data.data;
}

export async function createCategory(
  payload: CategoryMutationRequest,
): Promise<Category> {
  const response =
    await apiClient.post<ApiEnvelope<Category>>(
      "/api/categories",
      payload,
    );

  return response.data.data;
}

export async function updateCategory(
  categoryId: number,
  payload: CategoryMutationRequest,
): Promise<Category> {
  const response =
    await apiClient.patch<ApiEnvelope<Category>>(
      `/api/categories/${categoryId}`,
      payload,
    );

  return response.data.data;
}

export async function deleteCategory(
  categoryId: number,
): Promise<void> {
  await apiClient.delete<ApiEnvelope<string>>(
    `/api/categories/${categoryId}`,
  );
}