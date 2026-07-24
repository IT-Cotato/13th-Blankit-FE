import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CompletedTaskTopBar } from "@/components/mypage/CompletedTaskTopBar";
import { CompletedTaskCard } from "@/components/mypage/CompletedTaskCard";
import { mockCompletedTasks } from "@/mocks/completedTasks";

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
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase("ko-KR");
  const filteredTasks = mockCompletedTasks.filter((task) =>
    task.title
      .toLocaleLowerCase("ko-KR")
      .includes(normalizedSearchQuery),
  );

  return (
    <div className="flex min-h-dvh flex-col bg-black-900 pb-[max(24px,env(safe-area-inset-bottom))] text-black-100">
      <CompletedTaskTopBar onBack={() => navigate(-1)} />

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
            className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent pl-3 text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-600 outline-none placeholder:text-black-600 [&::-webkit-search-cancel-button]:appearance-none"
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
            filteredTasks.length === 0
              ? "flex-1 items-center justify-center"
              : ""
          }`}
        >
          {filteredTasks.map((task) => (
            <CompletedTaskCard
              key={task.taskId}
              completedAt={formatCompletedDate(task.deadline)}
              title={task.title}
              duration={formatElapsedTime(task.totalElapsedTime)}
            />
          ))}

          {filteredTasks.length === 0 && (
            <p className="text-center text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-100">
              검색 결과가 없습니다.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
