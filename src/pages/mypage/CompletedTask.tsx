import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCompletedTasks } from "@/api/mypage/completedTasks";
import { CompletedTaskCard } from "@/components/mypage/CompletedTaskCard";
import { MyPageDetailTopBar } from "@/components/mypage/MyPageDetailTopBar";
import { mockCompletedTasks } from "@/mocks/completedTasks";
import type { CompletedTaskItem } from "@/types/completedTask";

function formatCompletedDate(deadline: string) {
  const [year, month, day] = deadline.split("-").map(Number);

  if (!year || !month || !day) {
    return `${deadline} 완료`;
  }

  return `${year}/${month}/${day} 완료`;
}

function formatElapsedTime(totalElapsedTime: number) {
  const hours = Math.floor(totalElapsedTime / 3600);
  const minutes = Math.floor((totalElapsedTime % 3600) / 60);
  const seconds = totalElapsedTime % 60;

  return `${hours}시간 ${minutes}분 ${seconds}초`;
}

export function CompletedTask() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [tasks, setTasks] = useState<CompletedTaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    const loadCompletedTasks = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const params = {
          keyword: debouncedSearchQuery || undefined,
          size: 100,
        };
        const firstPage = await getCompletedTasks({ ...params, page: 0 });
        const remainingPages = await Promise.all(
          Array.from(
            { length: Math.max(firstPage.totalPages - 1, 0) },
            (_, index) => getCompletedTasks({ ...params, page: index + 1 }),
          ),
        );

        if (!cancelled) {
          setTasks([
            ...firstPage.content,
            ...remainingPages.flatMap((page) => page.content),
          ]);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("완료한 과업을 불러오지 못했습니다.", error);
          const normalizedQuery = debouncedSearchQuery.toLocaleLowerCase("ko-KR");
          setTasks(
            mockCompletedTasks.filter((task) =>
              task.title
                .toLocaleLowerCase("ko-KR")
                .includes(normalizedQuery),
            ),
          );
          setErrorMessage(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadCompletedTasks();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearchQuery]);

  return (
    <div className="flex min-h-dvh flex-col bg-black-900 pb-[max(24px,env(safe-area-inset-bottom))] text-black-100">
      <MyPageDetailTopBar
        title="내 완료한 과업 보기"
        onBack={() => navigate("/mypage")}
      />

      <main className="flex min-h-0 flex-1 flex-col px-5">
        <label htmlFor="completed-task-search" className="sr-only">
          완료한 과업 검색
        </label>
        <div className="mb-5 mt-5 flex h-[42px] w-full items-center justify-between rounded-lg bg-black-800">
          <input
            id="completed-task-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="검색어 입력"
            className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent pl-3 text-base font-medium leading-[21px] tracking-[-0.21px] text-black-600 outline-none placeholder:text-black-600 [&::-webkit-search-cancel-button]:appearance-none"
          />

          {searchQuery && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => setSearchQuery("")}
              className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center gap-2.5 px-[3px] py-0.5"
            >
              <img
                src="/mypage/delete.svg"
                alt=""
                className="h-full w-full object-contain"
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        <section
          aria-label="완료한 과업 목록"
          className={`flex flex-col gap-3 ${
            tasks.length === 0
              ? "flex-1 items-center justify-center"
              : ""
          }`}
        >
          {tasks.map((task) => (
            <CompletedTaskCard
              key={task.taskId}
              completedAt={formatCompletedDate(task.deadline)}
              title={task.title}
              duration={formatElapsedTime(task.totalElapsedTime)}
            />
          ))}

          {!isLoading && tasks.length === 0 && (
            <p className="text-center text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-100">
              {errorMessage ?? "검색 결과가 없습니다."}
            </p>
          )}

          {isLoading && (
            <p
              role="status"
              className="text-center text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-600"
            >
              완료한 과업을 불러오는 중입니다.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
