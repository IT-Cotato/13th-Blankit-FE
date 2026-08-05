import { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  createCategory,
  deleteCategory,
  getAvailableCategoryColors,
  getCategories,
  updateCategory,
} from "@/api/categories";

import { TOAST_DURATION_MS } from "@/constants/toast";

import type { ApiEnvelope } from "@/types/auth";

import type {
  Category,
  CategoryFormMode,
  CategoryMutationRequest,
} from "@/types/category";

export type CategoryFlowView =
  | "composer"
  | "category-list"
  | "category-form";

interface UseCategoryFlowOptions {
  onReturnToComposer?: () => void;
  initialCategory?: Category | null;
}

export function useCategoryFlow({
  onReturnToComposer,
  initialCategory = null,
}: UseCategoryFlowOptions = {}) {
  const errorTimerRef = useRef<number | null>(null);

  const [view, setView] = useState<CategoryFlowView>("composer");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(initialCategory);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);
  const [pendingDeleteCategory, setPendingDeleteCategory] =
    useState<Category | null>(null);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [formMode, setFormMode] =
    useState<CategoryFormMode>("create");
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current !== null) {
        window.clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  function getApiErrorMessage(error: unknown): string {
    if (axios.isAxiosError<ApiEnvelope<unknown>>(error)) {
      return (
        error.response?.data?.message ??
        "요청을 처리하지 못했습니다."
      );
    }

    return error instanceof Error
      ? error.message
      : "요청을 처리하지 못했습니다.";
  }

  function showError(error: unknown) {
    const message = getApiErrorMessage(error);

    if (errorTimerRef.current !== null) {
      window.clearTimeout(errorTimerRef.current);
    }

    setErrorMessage(message);

    errorTimerRef.current = window.setTimeout(() => {
      setErrorMessage(null);
      errorTimerRef.current = null;
    }, TOAST_DURATION_MS);
  }

  async function openCategories() {
    setView("category-list");
    setEditable(false);
    setLoading(true);
    setErrorMessage(null);

    try {
      const nextCategories = await getCategories();
      setCategories(nextCategories);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  async function startCreate() {
    try {
      setLoading(true);
      const colors = await getAvailableCategoryColors();

      if (colors.length === 0) {
        showError(
          new Error("카테고리는 최대 10개까지 만들 수 있어요."),
        );
        return;
      }

      setAvailableColors(colors);
      setEditingCategory(null);
      setFormMode("create");
      setView("category-form");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  async function startUpdate(category: Category) {
    try {
      setLoading(true);
      const colors = await getAvailableCategoryColors(
        category.categoryId,
      );

      setAvailableColors(colors);
      setEditingCategory(category);
      setFormMode("update");
      setView("category-form");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  async function submitCategory(values: CategoryMutationRequest) {
    try {
      setSubmitting(true);

      if (formMode === "create") {
        const created = await createCategory(values);

        setCategories((current) => [...current, created]);
        setSelectedCategory(created);
      } else if (editingCategory) {
        const updated = await updateCategory(
          editingCategory.categoryId,
          values,
        );

        setCategories((current) =>
          current.map((category) =>
            category.categoryId === updated.categoryId
              ? updated
              : category,
          ),
        );
        setSelectedCategory((current) =>
          current?.categoryId === updated.categoryId ? updated : current,
        );
      }

      setEditingCategory(null);
      setView("category-list");
    } catch (error) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDeleteCategory) {
      return;
    }

    try {
      setSubmitting(true);

      const deletedCategoryId = pendingDeleteCategory.categoryId;
      await deleteCategory(deletedCategoryId);

      const remaining = categories.filter(
        (category) => category.categoryId !== deletedCategoryId,
      );

      setCategories(remaining);
      setSelectedCategory((current) =>
        current?.categoryId === deletedCategoryId
          ? null
          : current,
      );
      setPendingDeleteCategory(null);
    } catch (error) {
      setPendingDeleteCategory(null);
      showError(error);
    } finally {
      setSubmitting(false);
    }
  }

  function selectCategory(category: Category) {
    setSelectedCategory(category);
    setView("composer");
    onReturnToComposer?.();
  }

  function backToComposer() {
    setView("composer");
    setEditable(false);
    onReturnToComposer?.();
  }

  function backToList() {
    setEditingCategory(null);
    setView("category-list");
  }

  function toggleEditable() {
    setEditable((current) => !current);
  }

  return {
    view,
    categories,
    selectedCategory,
    editingCategory,
    pendingDeleteCategory,
    availableColors,
    formMode,
    editable,
    loading,
    submitting,
    errorMessage,
    openCategories,
    startCreate,
    startUpdate,
    submitCategory,
    confirmDelete,
    selectCategory,
    backToComposer,
    backToList,
    toggleEditable,
    requestDelete: setPendingDeleteCategory,
    cancelDelete: () => setPendingDeleteCategory(null),
  };
}
