import clockIcon from "@/assets/icons/search/search-clock.svg";
import clearIcon from "@/assets/icons/x-black-700.svg";
import type { SearchHistory } from "@/types/search";

type RecentSearchesProps = {
  searches: SearchHistory[];
  onRemove: (searchHistoryId: number) => void;
  onClear: () => void;
};

export function RecentSearch({
  searches,
  onRemove,
  onClear,
}: RecentSearchesProps) {
  const visibleSearches = searches.slice(0, 5);

  if (visibleSearches.length === 0) {
    return (
      <div className="pointer-events-none flex flex-1 items-center justify-center">
        <p className="text-[16px] font-medium text-black-100">
          검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <section className="px-5 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-black-200">
          최근 검색어
        </h2>

        <button
          type="button"
          onClick={onClear}
          className="text-[14px] font-medium text-black-700"
        >
          지우기
        </button>
      </div>

      <ul className="flex flex-col gap-4">
            {visibleSearches.map((search) => (
                <li
                key={search.searchHistoryId}
                className="flex items-center justify-between"
                >
                <div className="flex min-w-0 items-center gap-2">
                    <img
                    src={clockIcon}
                    alt=""
                    className="h-4 w-4 shrink-0"
                    />

                    <span className="truncate text-[14px] font-medium text-black-400">
                    {search.keyword}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => onRemove(search.searchHistoryId)}
                    aria-label={`${search.keyword} 최근 검색어 삭제`}
                    className="flex h-6 w-6 shrink-0 items-center justify-center"
                >
                    <img
                    src={clearIcon}
                    alt=""
                    className="h-2.5 w-2.5"
                    />
                </button>
                </li>
            ))}
        </ul>
    </section>
  );
}