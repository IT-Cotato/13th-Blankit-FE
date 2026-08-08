import { useState } from "react";

import { RecentSearch } from "@/components/home/search/RecentSearch";
import { SearchBar } from "@/components/home/search/SearchBar";
import { SearchResult } from "@/components/home/search/SearchResult";
import { useSearchHistories } from "@/components/home/search/hooks/useSearchHistories";
import { useTaskSearch } from "@/components/home/search/hooks/useTaskSearch";


interface SearchPageProps {
  onTaskClick: (taskId: number) => void;
}

export function SearchPage({
  onTaskClick,
}: SearchPageProps) {
  const [searchText, setSearchText] = useState("");

  const {
    searchResult,
    isLoading,
    errorMessage,
    search,
    resetSearch,
  } = useTaskSearch();

  const {
    recentSearches,
    refreshSearchHistories,
    removeSearchHistory,
    clearSearchHistories,
  } = useSearchHistories();

  const handleSearch = async (keyword: string) => {
    const result = await search(keyword);

    if (result) {
      await refreshSearchHistories();
    }
  };

  const handleSearchTextChange = (
    nextSearchText: string,
  ) => {
    setSearchText(nextSearchText);
    resetSearch();
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

      {!isLoading &&
        !errorMessage &&
        !hasSearched && (
          <RecentSearch
            searches={recentSearches}
            onRemove={removeSearchHistory}
            onClear={clearSearchHistories}
          />
        )}

      {(isLoading ||
        errorMessage ||
        hasSearched) && (
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
