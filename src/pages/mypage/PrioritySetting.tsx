import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MyPageDetailTopBar } from "@/components/mypage/MyPageDetailTopBar";
import {
  PriorityLevelTabs,
  type PriorityFilter,
} from "@/components/mypage/priority/PriorityLevelTabs";
import { PriorityTaskCard } from "@/components/mypage/priority/PriorityTaskCard";
import { mockPriorityTasks } from "@/mocks/priorityTasks";
import { getPriorityTasks, updateTaskStar } from "@/api/mypage/priority";
import type { PriorityTask } from "@/types/priority";

const priorityOrder = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
} as const;

export function PrioritySetting() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<PriorityTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] =
    useState<PriorityFilter>("ALL");
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase("ko-KR");
  const filteredTasks = tasks
    .filter(
      (task) =>
        (selectedPriority === "ALL" || task.priority === selectedPriority) &&
        task.title.toLocaleLowerCase("ko-KR").includes(normalizedSearchQuery),
    )
    .sort((a, b) =>
      selectedPriority === "ALL"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : 0,
    );

  useEffect(() => {
    let cancelled = false;

    const loadPriorityTasks = async () => {
      try {
        const priorityTasks = await getPriorityTasks();
        if (!cancelled) setTasks(priorityTasks);
      } catch (error) {
        console.error("우선순위 과업을 불러오지 못해 목 데이터를 표시합니다.", error);
        if (!cancelled) setTasks(mockPriorityTasks);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadPriorityTasks();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStarToggle = async (taskId: number) => {
    const task = tasks.find((item) => item.taskId === taskId);
    if (!task) return;

    const nextIsStarred = !task.isStarred;
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.taskId === taskId
          ? { ...task, isStarred: nextIsStarred }
          : task,
      ),
    );

    try {
      await updateTaskStar(taskId, nextIsStarred);
    } catch (error) {
      console.error("별표 변경에 실패해 목 데이터를 표시합니다.", error);
      setTasks(mockPriorityTasks);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-black-900 text-black-100">
      <MyPageDetailTopBar
        title="우선순위 설정"
        onBack={() => navigate("/mypage")}
      />

      <main className="flex min-h-0 flex-1 flex-col px-5 pb-[max(12px,env(safe-area-inset-bottom))]">
        <label htmlFor="priority-task-search" className="sr-only">
          우선순위 과업 검색
        </label>
        <div className="mb-5 mt-5 flex h-[42px] w-full items-center justify-between rounded-lg bg-black-800">
          <input
            id="priority-task-search"
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

        <h2 className="w-full text-left text-xl font-semibold leading-[30px] tracking-[-0.3px] text-black-100">
          중요한 과업 선택하기
        </h2>
        <p className="mt-2 w-full text-left text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-650">
          중요한 과업에 ⭐를 표시해 보세요.
          <br />
          추천 우선순위가 높아져요.
        </p>

        <div className="mt-7">
          <PriorityLevelTabs
            value={selectedPriority}
            onChange={setSelectedPriority}
          />
        </div>

        <section
          aria-label="우선순위 과업 목록"
          className={`mt-5 flex flex-col gap-3 ${
            filteredTasks.length === 0
              ? "flex-1 items-center justify-center"
              : ""
          }`}
        >
          {filteredTasks.map((task) => (
            <PriorityTaskCard
              key={task.taskId}
              taskId={task.taskId}
              title={task.title}
              categoryName={task.categoryName}
              categoryColor={task.categoryColor}
              priority={task.priority}
              progressRate={task.progressRate}
              isStarred={task.isStarred}
              lastMemo={task.lastMemo}
              onStarToggle={handleStarToggle}
            />
          ))}

          {!isLoading && filteredTasks.length === 0 && (
            <p className="text-center text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-100">
              검색 결과가 없습니다.
            </p>
          )}

          {isLoading && (
            <p role="status" className="text-center text-sm font-medium text-black-600">
              우선순위 과업을 불러오는 중입니다.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
