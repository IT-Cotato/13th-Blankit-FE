import { useEffect, useState } from "react";

import type {
  SearchTaskData,
  SearchTaskResponse,
} from "@/types/search";
import type { Task } from "@/types/task";

type SearchTasksParams = {
  keyword: string;
  page?: number;
  size?: number;
};

type UseTaskSearchResult = {
  searchText: string;
  setSearchText: (searchText: string) => void;
  searchResult: SearchTaskData | null;
  isLoading: boolean;
  errorMessage: string | null;
};

async function searchTasks({
  keyword,
  tasks,
  page = 0,
  size = 20,
}: SearchTasksParams & {
  tasks: Task[];
}): Promise<SearchTaskResponse> {
  const normalizedKeyword = keyword
    .trim()
    .toLocaleLowerCase("ko-KR");

  const filteredTasks = tasks.filter((task) =>
    task.title
      .toLocaleLowerCase("ko-KR")
      .includes(normalizedKeyword),
  );

  const startIndex = page * size;
  const searchedTasks = filteredTasks
    .slice(startIndex, startIndex + size)
    .map(
      ({
        taskId,
        title,
        category,
        priority,
        deadline,
        status,
        progressRate,
      }) => ({
        taskId,
        title,
        category,
        priority,
        deadline,
        status,
        progressRate,
      }),
    );

  return {
    code: "SEARCH200",
    message: "검색에 성공했습니다.",
    data: {
      totalCount: filteredTasks.length,
      tasks: searchedTasks,
    },
  };
}

export function useTaskSearch(
  tasks: Task[],
): UseTaskSearchResult {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] =
    useState<SearchTaskData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const handleSearchTextChange = (
    nextSearchText: string,
  ) => {
    setSearchText(nextSearchText);
    setSearchResult(null);
    setErrorMessage(null);
    setIsLoading(nextSearchText.trim().length > 0);
  };

  useEffect(() => {
    const trimmedKeyword = searchText.trim();

    if (!trimmedKeyword) {
      return;
    }

    let isCancelled = false;

    const debounceTimer = window.setTimeout(async () => {
      try {
        const response = await searchTasks({
          keyword: trimmedKeyword,
          tasks,
        });

        if (!isCancelled) {
          setSearchResult(response.data);
        }
      } catch {
        if (!isCancelled) {
          setSearchResult(null);
          setErrorMessage(
            "검색 중 문제가 발생했습니다.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      isCancelled = true;
      window.clearTimeout(debounceTimer);
    };
  }, [searchText, tasks]);

  return {
    searchText,
    setSearchText: handleSearchTextChange,
    searchResult,
    isLoading,
    errorMessage,
  };
}
