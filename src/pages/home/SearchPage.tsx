import { useState } from "react";

import { RecentSearch } from "@/components/home/search/RecentSearch";
import { SearchBar } from "@/components/home/search/SearchBar";
import { SearchResult } from "@/components/home/search/SearchResult";
import { useTaskSearch } from "@/components/home/search/hooks/useTaskSearch";
import { mockSearchHistorySuccess } from "@/mocks/searchMockData";

import type { SearchHistory } from "@/types/search";
import type { Task } from "@/types/task";

interface SearchPageProps {
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
}

export function SearchPage({
  tasks,
  onTaskClick,
}: SearchPageProps) {
  const [recentSearches, setRecentSearches] =
    useState<SearchHistory[]>(
      mockSearchHistorySuccess.data,
    );
  const [searchText, setSearchText] = useState("");

  const {
    searchResult,
    isLoading,
    errorMessage,
    search,
    resetSearch,
  } = useTaskSearch(tasks);

  const handleSearch = async (keyword: string) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    await search(trimmedKeyword);

    const newSearchHistory: SearchHistory = {
      searchHistoryId: Date.now(),
      keyword: trimmedKeyword,
      searchedAt: new Date().toISOString(),
    };

    setRecentSearches((previousSearches) => [
      newSearchHistory,
      ...previousSearches.filter(
        (search) =>
          search.keyword.toLocaleLowerCase("ko-KR") !==
          trimmedKeyword.toLocaleLowerCase("ko-KR"),
      ),
    ]);
  };

  const handleSearchTextChange = (
    nextSearchText: string,
  ) => {
    setSearchText(nextSearchText);
    resetSearch();
  };

  const handleRemoveSearch = (
    searchHistoryId: number,
  ) => {
    setRecentSearches((previousSearches) =>
      previousSearches.filter(
        (search) =>
          search.searchHistoryId !== searchHistoryId,
      ),
    );
  };

  const handleClearSearches = () => {
    setRecentSearches([]);
  };

  const hasSearched = searchResult !== null;

  return (
    <div
      className="
        flex
        min-h-[calc(100dvh_-_90px_-_env(safe-area-inset-bottom))]
        flex-col
      "
    >
      <SearchBar
        searchText={searchText}
        onSearch={handleSearch}
        onSearchTextChange={handleSearchTextChange}
      />

      {!isLoading && !errorMessage && !hasSearched && (
        <RecentSearch
          searches={recentSearches}
          onRemove={handleRemoveSearch}
          onClear={handleClearSearches}
        />
      )}

      {(isLoading || errorMessage || hasSearched) && (
        <SearchResult
          searchResult={searchResult}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onTaskClick={onTaskClick}
        />
      )}
    </div>
  );
}
