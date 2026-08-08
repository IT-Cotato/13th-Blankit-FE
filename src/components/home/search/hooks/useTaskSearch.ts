import { useRef, useState } from "react";

import { searchTasks } from "@/api/search";

import type { SearchTaskData } from "@/types/search";

type UseTaskSearchResult = {
  searchResult: SearchTaskData | null;
  isLoading: boolean;
  errorMessage: string | null;
  search: (
    keyword: string,
  ) => Promise<SearchTaskData | null>;
  resetSearch: () => void;
};

export function useTaskSearch():
UseTaskSearchResult {
  const [searchResult, setSearchResult] =
    useState<SearchTaskData | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const requestIdRef = useRef(0);

  const search = async (
    keyword: string,
  ): Promise<SearchTaskData | null> => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return null;
    }

    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await searchTasks({
        keyword: trimmedKeyword,
        page: 0,
        size: 20,
      });

      if (requestId !== requestIdRef.current) {
        return null;
      }

      setSearchResult(result);

      return result;
    } catch {
      if (requestId !== requestIdRef.current) {
        return null;
      }

      setSearchResult(null);
      setErrorMessage(
        "검색 중 문제가 발생했습니다.",
      );

      return null;
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const resetSearch = () => {
    requestIdRef.current += 1;

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