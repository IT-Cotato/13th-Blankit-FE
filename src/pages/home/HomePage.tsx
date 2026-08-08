import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import sadBunnyIcon from "@/assets/icons/sad-bunny.svg";

import { DockedTaskTimeBar } from "@/components/home/DockedTaskTimeBar";
import { HomeTopBar } from "@/components/home/HomeTopBar";
import { RecommendedTaskTimeCard } from "@/components/home/RecommendedTaskTimeCard";
import { WeeklyCalendar } from "@/components/home/WeeklyCalendar";
import { TodayRecommendedTasks } from "@/components/task/TodayRecommendedTasks";
import { TaskCombinationSection } from "@/components/task-combination/TaskCombinationSection";

import { useTodayRecommendations } from "@/hooks/useTodayRecommendations";

import { usePlaylistStore } from "@/store/usePlaylistStore";

import { shouldShowDockedTaskTimeBar } from "@/utils/homeDockedTaskTimeBar";

const HOME_TOP_BAR_HEIGHT = 50;

interface HomePageProps {
  refreshKey: number;
  onAddTask: () => void;
  onTaskClick: (taskId: number) => void;
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
          중요한 일과 오늘의 권장 시간을
          추천해드려요.
        </p>
      </div>
    </div>
  );
}

export function HomePage({
  refreshKey,
  onAddTask,
  onTaskClick,
}: HomePageProps) {
  const navigate = useNavigate();

  const taskCardRef =
    useRef<HTMLDivElement>(null);

  const [showDockedBar, setShowDockedBar] =
    useState(false);

  const currentPlaylistTask =
    usePlaylistStore(
      (state) => state.playlist[0],
    );

  const {
    recommendedTasks,
    loadingRecommendations,
    recommendationError,
  } = useTodayRecommendations(
    refreshKey,
  );

  const hasTasks =
    recommendedTasks.length > 0;

  useEffect(() => {
    if (
      !hasTasks ||
      currentPlaylistTask
    ) {
      return;
    }

    const taskCard =
      taskCardRef.current;

    if (!taskCard) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setShowDockedBar(
            shouldShowDockedTaskTimeBar({
              hasCurrentPlaylistTask:
                false,
              isCardVisible:
                entry.isIntersecting,
              hasPassedTopBar:
                entry.boundingClientRect
                  .bottom <=
                HOME_TOP_BAR_HEIGHT,
            }),
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
  }, [
    currentPlaylistTask,
    hasTasks,
  ]);

  const shouldRenderDockedBar =
    !currentPlaylistTask &&
    showDockedBar;

  return (
    <>
      <HomeTopBar
        showRegistrationHint={
          !loadingRecommendations &&
          recommendationError === null &&
          !hasTasks
        }
        onAddTask={onAddTask}
      />

      {loadingRecommendations ? (
        <div className="flex min-h-60 items-center justify-center px-5">
          <p className="text-[14px] font-medium text-black-500">
            오늘 추천 과업을 불러오는
            중입니다.
          </p>
        </div>
      ) : recommendationError ? (
        <div className="flex min-h-60 items-center justify-center px-5">
          <p className="text-center text-[14px] font-medium text-red-400">
            {recommendationError}
          </p>
        </div>
      ) : hasTasks ? (
        <>
          <div
            className={`flex flex-col gap-5 px-5 pt-5 ${
              shouldRenderDockedBar
                ? "pb-[90px]"
                : ""
            }`}
          >
            <WeeklyCalendar />

            <div ref={taskCardRef}>
              <RecommendedTaskTimeCard />
            </div>

            <TodayRecommendedTasks
              tasks={recommendedTasks}
              onViewAll={() => {
                navigate(
                  "/task-recommendations",
                );
              }}
              onTaskClick={
                onTaskClick
              }
            />

            <TaskCombinationSection />
          </div>

          {shouldRenderDockedBar && (
            <DockedTaskTimeBar />
          )}
        </>
      ) : (
        <HomeEmptyState />
      )}
    </>
  );
}