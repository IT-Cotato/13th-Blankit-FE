import { useState } from "react";

import { RecentSearch } from "@/components/home/search/RecentSearch";
import { SearchBar } from "@/components/home/search/SearchBar";
import { TaskChip } from "@/components/task/TaskChip";
import { mockSearchHistorySuccess } from "@/mocks/searchMockData";
import { mockTasks } from "@/mocks/tasks";

import type {
  SearchHistory,
  SearchTaskData,
  SearchTaskResponse,
} from "@/types/search";

type SearchTasksParams = {
  keyword: string;
  page?: number;
  size?: number;
};

/**
 * 현재는 mockTasks를 검색합니다.
 * 실제 API가 나오면 이 함수 내부만 fetch 호출로 교체합니다.
 */
async function searchTasks({
  keyword,
  page = 0,
  size = 20,
}: SearchTasksParams): Promise<SearchTaskResponse> {
  const normalizedKeyword = keyword
    .trim()
    .toLowerCase();

  const filteredTasks = mockTasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(normalizedKeyword),
  );

  const startIndex = page * size;

  const tasks = filteredTasks
    .slice(startIndex, startIndex + size)
    .map(
      ({
        taskId,
        title,
        categoryId,
        categoryName,
        categoryColor,
        priority,
        deadline,
        status,
        progressRate,
      }) => ({
        taskId,
        title,
        categoryId,
        categoryName,
        categoryColor,
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
      tasks,
    },
  };
}

export function SearchPage() {
  const [recentSearches, setRecentSearches] =
    useState<SearchHistory[]>(
      mockSearchHistorySuccess.data,
    );

  const [searchResult, setSearchResult] =
    useState<SearchTaskData | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const handleSearch = async (keyword: string) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    const newSearchHistory: SearchHistory = {
      searchHistoryId: Date.now(),
      keyword: trimmedKeyword,
      searchedAt: new Date().toISOString(),
    };

    // 같은 검색어가 있으면 기존 항목을 제거하고
    // 새로운 검색 기록을 맨 앞으로 옮깁니다.
    setRecentSearches((previousSearches) => [
      newSearchHistory,
      ...previousSearches.filter(
        (search) =>
          search.keyword.toLowerCase() !==
          trimmedKeyword.toLowerCase(),
      ),
    ]);

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await searchTasks({
        keyword: trimmedKeyword,
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

  const handleSearchTextChange = () => {
    setSearchResult(null);
    setErrorMessage(null);
  }

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

  const handleTaskClick = (taskId: number) => {
    console.log("선택한 과업 ID:", taskId);
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
        onSearch={handleSearch}
        onSearchTextChange={handleSearchTextChange}
      />

      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[16px] font-medium text-black-100">
            검색 중입니다.
          </p>
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[16px] font-medium text-red-400">
            {errorMessage}
          </p>
        </div>
      )}

      {!isLoading &&
        !errorMessage &&
        !hasSearched && (
          <RecentSearch
            searches={recentSearches}
            onRemove={handleRemoveSearch}
            onClear={handleClearSearches}
          />
        )}

      {!isLoading &&
        !errorMessage &&
        hasSearched &&
        searchResult.totalCount === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[16px] font-medium text-black-100">
              검색 결과가 없습니다.
            </p>
          </div>
        )}

      {!isLoading &&
        !errorMessage &&
        hasSearched &&
        searchResult.totalCount > 0 && (
          <section className="px-5 pt-5">
            <h2 className="mb-4 text-[14px] font-semibold text-black-200">
              검색 결과 ({searchResult.totalCount})
            </h2>

            <ul className="flex flex-col gap-3">
              {searchResult.tasks.map((task) => (
                <li key={task.taskId}>
                  <TaskChip
                    title={task.title}
                    lastMemo={null}
                    progressRate={task.progressRate}
                    priority={task.priority}
                    status={task.status}
                    onClick={() =>
                      handleTaskClick(task.taskId)
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
    </div>
  );
}