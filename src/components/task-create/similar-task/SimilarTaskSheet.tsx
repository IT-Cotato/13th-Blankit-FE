import { useState } from "react";

import backIcon from "@/assets/icons/back-button-black-600.svg";
import clearIcon from "@/assets/icons/x-black-700.svg";

import type { Category } from "@/types/category";

import { SimilarTaskCard } from "./SimilarTaskCard";
import { toggleSelectedTask } from "./similarTaskUtils";
import { useSimilarTaskSearch } from "./useSimilarTaskSearch";

interface SimilarTaskSheetProps {
  categories: Category[];
  submitting: boolean;
  onBack: () => void;
  onComplete: (
    similarTaskId: number | null,
  ) => void | Promise<void>;
}

export function SimilarTaskSheet({
  categories,
  submitting,
  onBack,
  onComplete,
}: SimilarTaskSheetProps) {
  const {
    tasks,
    query,
    selectedCategoryId,
    loading,
    errorMessage,
    setQuery,
    setSelectedCategoryId,
  } = useSimilarTaskSearch();

  const [
    selectedTaskId,
    setSelectedTaskId,
  ] = useState<number | null>(null);

  const hasSelection =
    selectedTaskId !== null;

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="비슷한 과업 선택 화면"
      className="fixed inset-0 z-[80] flex flex-col rounded-t-[24px] bg-black-850 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
    >
      <header className="relative flex h-[58px] shrink-0 items-center justify-center px-5">
        <button
          type="button"
          aria-label="과업 입력으로 돌아가기"
          disabled={submitting}
          onClick={onBack}
          className="absolute left-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-start"
        >
          <img
            src={backIcon}
            alt=""
            className="h-3 w-2"
          />
        </button>

        <h2 className="text-[16px] font-semibold text-black-100">
          비슷한 과업 선택하기
        </h2>
      </header>

      <div className="shrink-0 px-5 pb-4">
        <label className="flex h-12 items-center rounded-[6px] bg-black-800 px-4">
          <input
            type="search"
            aria-label="비슷한 과업 검색"
            value={query}
            placeholder="검색어 입력"
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedTaskId(null);
            }}
            className="min-w-0 flex-1 bg-transparent text-[16px] text-black-100 outline-none placeholder:text-black-600 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />

          {query.length > 0 && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => {
                setQuery("");
                setSelectedTaskId(null);
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center gap-2.5 px-[3px] py-0.5"
            >
              <img
                src={clearIcon}
                alt=""
                className="h-3 w-3"
              />
            </button>
          )}
        </label>

        {categories.length > 0 && (
          <div className="-mx-5 mt-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2.5">
              <button
                type="button"
                aria-pressed={
                  selectedCategoryId === null
                }
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSelectedTaskId(null);
                }}
                className={`h-[33px] rounded-[6px] px-2.5 py-1.5 text-[14px] font-medium transition-colors ${
                  selectedCategoryId === null
                    ? "bg-black-650 text-black-900"
                    : "bg-black-750/50 text-black-500"
                }`}
              >
                전체
              </button>

              {categories.map((category) => {
                const active =
                  selectedCategoryId ===
                  category.categoryId;

                return (
                  <button
                    key={category.categoryId}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedCategoryId(
                        category.categoryId,
                      );
                      setSelectedTaskId(null);
                    }}
                    className={`h-[33px] rounded-[6px] px-2.5 py-1.5 text-[14px] font-medium transition-colors ${
                      active
                        ? "bg-black-650 text-black-900"
                        : "bg-black-750/50 text-black-500"
                    }`}
                  >
                    {category.categoryName}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        {loading ? (
          <div className="flex h-full min-h-40 items-center justify-center">
            <p className="text-[14px] font-semibold text-black-500">
              이전 과업을 불러오는 중입니다.
            </p>
          </div>
        ) : errorMessage ? (
          <div className="flex h-full min-h-40 items-center justify-center">
            <p className="text-[14px] font-semibold text-red-400">
              {errorMessage}
            </p>
          </div>
        ) : tasks.length > 0 ? (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <SimilarTaskCard
                key={task.taskId}
                task={task}
                selected={
                  selectedTaskId === task.taskId
                }
                onClick={() => {
                  setSelectedTaskId((current) =>
                    toggleSelectedTask(
                      current,
                      task.taskId,
                    ),
                  );
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-40 items-center justify-center">
            <p className="text-[14px] font-semibold text-black-100">
              이전 완료 과업이 없습니다.
            </p>
          </div>
        )}
      </div>

      <footer className="flex shrink-0 gap-[10px] border-t border-black-800 bg-black-850 px-5 pb-5 pt-4">
        <button
          type="button"
          disabled={hasSelection || submitting}
          onClick={() => onComplete(null)}
          className="h-12 grow basis-auto rounded-[8px] bg-black-700 px-[24px] text-[14px] font-medium text-black-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          비슷한 경험이 없어요
        </button>

        <button
          type="button"
          disabled={
            !hasSelection || submitting
          }
          onClick={() =>
            onComplete(selectedTaskId)
          }
          className="h-12 grow basis-auto rounded-[8px] bg-green-500 px-[24px] text-[14px] font-medium text-black-900 disabled:cursor-not-allowed disabled:bg-black-600 disabled:text-black-900"
        >
          선택
        </button>
      </footer>
    </section>
  );
}
