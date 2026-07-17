import { useState } from "react";

import { RecentSearch } from "@/components/home/search/RecentSearch";
import { SearchBar } from "@/components/home/search/SearchBar";
import { mockSearchHistorySuccess } from "@/mocks/searchMockData";
import type { SearchHistory } from "@/types/search";

export function SearchPage() {
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>(
    mockSearchHistorySuccess.data,
  );

  const handleSearch = (keyword: string) => {
    const newSearchHistory: SearchHistory = {
      searchHistoryId: Date.now(),
      keyword,
      searchedAt: new Date().toISOString(),
    };

    setRecentSearches((previousSearches) =>
      [newSearchHistory, ...previousSearches].slice(0, 5),
    );
  };

  const handleRemoveSearch = (searchHistoryId: number) => {
    setRecentSearches((previousSearches) =>
      previousSearches.filter(
        (search) => search.searchHistoryId !== searchHistoryId,
      ),
    );
  };

  const handleClearSearches = () => {
    setRecentSearches([]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black-900">
      <SearchBar onSearch={handleSearch} />

      <RecentSearch
        searches={recentSearches}
        onRemove={handleRemoveSearch}
        onClear={handleClearSearches}
      />
    </div>
  );
}