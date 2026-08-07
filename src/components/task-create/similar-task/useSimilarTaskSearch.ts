import { useEffect, useState } from "react";

import { getTaskHistory } from "@/api/tasks";

import type { TaskHistoryItemResponse } from "@/types/taskApi";

export function useSimilarTaskSearch() {
  const [tasks, setTasks] = useState<
    TaskHistoryItemResponse[]
  >([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] =
    useState("");
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    async function loadTaskHistory() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const response = await getTaskHistory({
          keyword:
            debouncedQuery.length > 0
              ? debouncedQuery
              : undefined,
          categoryId: selectedCategoryId ?? undefined,
          page: 0,
          size: 20,
        });

        if (!cancelled) {
          setTasks(response.content);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(error);
        setTasks([]);
        setErrorMessage(
          "이전 완료 과업을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTaskHistory();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, selectedCategoryId]);

  return {
    tasks,
    query,
    selectedCategoryId,
    loading,
    errorMessage,
    setQuery,
    setSelectedCategoryId,
  };
}
