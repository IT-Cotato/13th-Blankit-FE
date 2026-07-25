import { useMemo, useState } from "react";

import backIcon from "@/assets/icons/header/back.svg";
import type { Task } from "@/types/task";

import { SimilarTaskCard } from "./SimilarTaskCard";
import {
  filterSimilarTasks,
  getTaskCategories,
  toggleSelectedTask,
} from "./similarTaskUtils";

interface SimilarTaskSheetProps {
  tasks: Task[];
  onBack: () => void;
  onComplete: (similarTaskId: number | null) => void;
}

export function SimilarTaskSheet({
  tasks,
  onBack,
  onComplete,
}: SimilarTaskSheetProps) {
  const categories = useMemo(() => getTaskCategories(tasks), [tasks]);
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | null
  >(() => categories[0]?.categoryId ?? null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(
    null,
  );

  const visibleTasks = useMemo(
    () => filterSimilarTasks(tasks, query, selectedCategoryId),
    [query, selectedCategoryId, tasks],
  );

  const hasSelection = selectedTaskId !== null;

  function clearHiddenSelection(
    nextQuery: string,
    nextCategoryId: number | null,
  ) {
    if (
      selectedTaskId !== null &&
      !filterSimilarTasks(tasks, nextQuery, nextCategoryId).some(
        (task) => task.taskId === selectedTaskId,
      )
    ) {
      setSelectedTaskId(null);
    }
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="비슷한 과업 수정 화면"
      className="fixed inset-0 z-[80] flex flex-col rounded-t-[24px] bg-black-850 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
    >
      <header className="relative flex h-[58px] shrink-0 items-center justify-center px-5">
        <button
          type="button"
          aria-label="과업 입력으로 돌아가기"
          onClick={onBack}
          className="absolute left-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-start"
        >
          <img src={backIcon} alt="" className="h-3 w-2" />
        </button>
        <h2 className="text-[16px] font-semibold text-black-100">
          비슷한 과업 선택하기
        </h2>
      </header>

      <div className="shrink-0 px-5">
        <label className="flex h-12 items-center rounded-[6px] bg-black-800 px-4">
          <input
            type="search"
            aria-label="비슷한 과업 검색"
            value={query}
            placeholder="검색어 입력"
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);
              clearHiddenSelection(nextQuery, selectedCategoryId);
            }}
            className="min-w-0 flex-1 bg-transparent text-[16px] text-black-100 outline-none placeholder:text-black-600"
          />
        </label>

        {categories.length > 0 && (
          <div className="-mx-5 mt-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2">
              {categories.map((category) => {
                const active =
                  selectedCategoryId === category.categoryId;

                return (
                  <button
                    key={category.categoryId}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedCategoryId(category.categoryId);
                      setSelectedTaskId(null);
                    }}
                    className={`h-9 rounded-[8px] px-3 text-[14px] font-medium transition-colors ${
                      active
                        ? "bg-black-650 text-black-900"
                        : "bg-black-750 text-black-500"
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

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-4">
        {visibleTasks.length > 0 ? (
          <div className="flex flex-col gap-3">
            {visibleTasks.map((task) => (
              <SimilarTaskCard
                key={task.taskId}
                task={task}
                selected={selectedTaskId === task.taskId}
                onClick={() => {
                  setSelectedTaskId((current) =>
                    toggleSelectedTask(current, task.taskId),
                  );
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-40 items-center justify-center">
            <p className="text-[14px] font-semibold text-black-100">
              재생 목록이 없습니다.
            </p>
          </div>
        )}
      </div>

      <footer className="flex shrink-0 gap-[10px] border-t border-black-800 bg-black-850 px-5 pb-5 pt-4">
        <button
          type="button"
          disabled={hasSelection}
          onClick={() => onComplete(null)}
          className="h-12 grow basis-auto rounded-[8px] bg-black-700 px-[24px] text-[14px] font-medium text-black-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          비슷한 경험이 없어요.
        </button>
        <button
          type="button"
          disabled={!hasSelection}
          onClick={() => onComplete(selectedTaskId)}
          className="h-12 grow basis-auto rounded-[8px] bg-green-500 px-[24px] text-[14px] font-medium text-black-900 disabled:cursor-not-allowed disabled:bg-black-600 disabled:text-black-900"
        >
          선택
        </button>
      </footer>
    </section>
  );
}
