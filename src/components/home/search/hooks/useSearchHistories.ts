import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  deleteAllSearchHistories,
  deleteSearchHistory,
  getSearchHistories,
} from "@/api/search";

import type { SearchHistory } from "@/types/search";

type UseSearchHistoriesResult = {
  recentSearches: SearchHistory[];
  refreshSearchHistories: () => Promise<void>;
  removeSearchHistory: (
    searchHistoryId: number,
  ) => Promise<void>;
  clearSearchHistories: () => Promise<void>;
};

export function useSearchHistories():
UseSearchHistoriesResult {
  const [recentSearches, setRecentSearches] =
    useState<SearchHistory[]>([]);

  const refreshSearchHistories =
    useCallback(async () => {
      try {
        const histories = await getSearchHistories({
          page: 0,
          size: 5,
        });

        setRecentSearches(histories);
      } catch (error) {
        console.error(
          "최근 검색어를 불러오지 못했습니다.",
          error,
        );
      }
    }, []);

  const removeSearchHistory = async (
    searchHistoryId: number,
  ) => {
    try {
      await deleteSearchHistory(searchHistoryId);

      setRecentSearches((previousSearches) =>
        previousSearches.filter(
          (search) =>
            search.searchHistoryId !==
            searchHistoryId,
        ),
      );
    } catch (error) {
      console.error(
        "최근 검색어를 삭제하지 못했습니다.",
        error,
      );
    }
  };

  const clearSearchHistories = async () => {
    try {
      await deleteAllSearchHistories();

      setRecentSearches([]);
    } catch (error) {
      console.error(
        "최근 검색어를 모두 삭제하지 못했습니다.",
        error,
      );
    }
  };

  useEffect(() => {
    let isCancelled = false;

    getSearchHistories({
        page: 0,
        size: 5,
    })
        .then((histories) => {
        if (!isCancelled) {
            setRecentSearches(histories);
        }
        })
        .catch((error: unknown) => {
        console.error(
            "최근 검색어를 불러오지 못했습니다.",
            error,
        );
        });

    return () => {
        isCancelled = true;
    };
    }, []);

  return {
    recentSearches,
    refreshSearchHistories,
    removeSearchHistory,
    clearSearchHistories,
  };
}