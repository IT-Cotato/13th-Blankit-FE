import { useEffect, useRef, useState } from "react";

import {
  createMockCategory,
  deleteMockCategory,
  getMockAvailableColors,
  getMockCategories,
  updateMockCategory,
} from "@/mocks/categories";

import type {
  Category,
  CategoryMutationRequest,
} from "@/types/category";

export type CategoryFlowView =
  | "composer"
  | "category-list"
  | "category-form";

export type CategoryFormMode = "create" | "update";

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

  function showError(error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "요청을 처리하지 못했습니다.";

    if (errorTimerRef.current !== null) {
      window.clearTimeout(errorTimerRef.current);
    }

    setErrorMessage(message);
    errorTimerRef.current = window.setTimeout(() => {
      setErrorMessage(null);
      errorTimerRef.current = null;
    }, 2500);
  }

  async function openCategories() {
    setView("category-list");
    setEditable(false);
    setLoading(true);
    setErrorMessage(null);

    try {
      const nextCategories = await getMockCategories();
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
      const colors = await getMockAvailableColors();

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
      const colors = await getMockAvailableColors(category.categoryId);

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
        const created = await createMockCategory(values);

        setCategories((current) => [...current, created]);
        setSelectedCategory(created);
      } else if (editingCategory) {
        const updated = await updateMockCategory(
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
      await deleteMockCategory(deletedCategoryId);

      const remaining = categories.filter(
        (category) => category.categoryId !== deletedCategoryId,
      );

      setCategories(remaining);
      setSelectedCategory((current) =>
        current?.categoryId === deletedCategoryId
          ? remaining[0] ?? null
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
