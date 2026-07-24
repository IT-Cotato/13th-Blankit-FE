import {
  useEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

import sadBunnyIcon from "@/assets/icons/sad-bunny.svg";

import { DockedTaskTimeBar } from "@/components/home/DockedTaskTimeBar";
import { HomeTopBar } from "@/components/home/HomeTopBar";
import { RecommendedTaskTimeCard } from "@/components/home/RecommendedTaskTimeCard";
import { WeeklyCalendar } from "@/components/home/WeeklyCalendar";

import {
  TaskCreateComposer,
  type TaskCreateComposerHandle,
} from "@/components/task-create/TaskCreateComposer";

import { TodayRecommendedTasks } from "@/components/task/TodayRecommendedTasks";

import { mockTasks } from "@/mocks/tasks";

const HOME_TOP_BAR_HEIGHT = 50;

interface HomePageProps {
  isTaskComposerOpen: boolean;
  onTaskComposerOpen: () => void;
  onTaskComposerClose: () => void;
}

function HomeEmptyState() {
  return (
    <div
      className="
        flex min-h-[calc(100dvh-140px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]
        items-center justify-center px-5
      "
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={sadBunnyIcon}
          alt=""
          className="mb-7 h-[140px] w-[140px]"
        />

        <h1
          className="
            text-[18px] font-bold
            leading-[150%] tracking-[-0.02em]
            text-black-100
          "
        >
          아직 과업이 없어요
        </h1>

        <p
          className="
            mt-3 text-[14px] font-medium
            leading-[150%] tracking-[-0.02em]
            text-black-600
          "
        >
          과업을 등록하면 지금 가장
          <br />
          중요한 일과 오늘의 권장 시간을 추천해드려요.
        </p>
      </div>
    </div>
  );
}

export function HomePage({
  isTaskComposerOpen,
  onTaskComposerOpen,
  onTaskComposerClose,
}: HomePageProps) {
  const navigate = useNavigate();

  const taskCardRef =
    useRef<HTMLDivElement>(null);

  const taskComposerRef =
    useRef<TaskCreateComposerHandle>(null);

  const [showDockedBar, setShowDockedBar] =
    useState(false);

  const [taskTitle, setTaskTitle] =
    useState("");

  // 빈 화면을 확인하고 싶다면 아래 코드 사용
  // const tasks = mockTasks.slice(0, 0);
  const tasks = mockTasks;

  const hasTasks = tasks.length > 0;

  useEffect(() => {
    if (!hasTasks) {
      setShowDockedBar(false);
      return;
    }

    const taskCard = taskCardRef.current;

    if (!taskCard) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isOutsideVisibleArea =
          !entry.isIntersecting;

        const hasPassedTopBar =
          entry.boundingClientRect.bottom <=
          HOME_TOP_BAR_HEIGHT;

        setShowDockedBar(
          isOutsideVisibleArea &&
            hasPassedTopBar,
        );
      },
      {
        threshold: 0,
        rootMargin: `-${HOME_TOP_BAR_HEIGHT}px 0px 0px 0px`,
      },
    );

    observer.observe(taskCard);

    return () => {
      observer.disconnect();
    };
  }, [hasTasks]);

  function handleOpenTaskComposer() {
    /*
     * App의 상태 변경을 즉시 반영한 다음
     * input에 포커스를 적용합니다.
     *
     * 모바일에서 사용자 클릭 직후 input에
     * 포커스해야 키보드가 안정적으로 열립니다.
     */
    flushSync(() => {
      onTaskComposerOpen();
    });

    taskComposerRef.current?.focus();
  }

  function handleCloseTaskComposer() {
    onTaskComposerClose();
    setTaskTitle("");
  }

  function handleNext() {
    const trimmedTitle = taskTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    // 유사 과업 선택 페이지 구현 전 임시 확인
    console.log(
      "입력한 과업명:",
      trimmedTitle,
    );

    /*
     * 유사 과업 선택 페이지를 만든 후:
     *
     * navigate("/tasks/new/similar");
     */
  }

  function handleTaskClick(taskId: number) {
    console.log("선택한 과업:", taskId);
  }

  return (
    <>
      <HomeTopBar
        showRegistrationHint={!hasTasks}
        onAddTask={handleOpenTaskComposer}
      />

      {hasTasks ? (
        <>
          <div className="flex flex-col gap-5 px-5 pt-5">
            <WeeklyCalendar />

            <div ref={taskCardRef}>
              <RecommendedTaskTimeCard />
            </div>

            <TodayRecommendedTasks
              tasks={tasks}
              onViewAll={() => {
                navigate(
                  "/task-recommendations",
                );
              }}
              onTaskClick={handleTaskClick}
            />
          </div>

          {showDockedBar && (
            <DockedTaskTimeBar />
          )}
        </>
      ) : (
        <HomeEmptyState />
      )}

      {isTaskComposerOpen && (
        <TaskCreateComposer
          ref={taskComposerRef}
          title={taskTitle}
          onTitleChange={setTaskTitle}
          onClose={handleCloseTaskComposer}
          onNext={handleNext}
        />
      )}
    </>
  );
}