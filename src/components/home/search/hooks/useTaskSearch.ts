import { useState } from "react";

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
  searchResult: SearchTaskData | null;
  isLoading: boolean;
  errorMessage: string | null;
  search: (keyword: string) => Promise<void>;
  resetSearch: () => void;
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
  const [searchResult, setSearchResult] =
    useState<SearchTaskData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const search = async (keyword: string) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await searchTasks({
        keyword: trimmedKeyword,
        tasks,
      });

      setSearchResult(response.data);
    } catch {
      setSearchResult(null);
      setErrorMessage(
        "검색 중 문제가 발생했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchResult(null);
    setErrorMessage(null);
    setIsLoading(false);
  };

  return {
    searchResult,
    isLoading,
    errorMessage,
    search,
    resetSearch,
  };
}
