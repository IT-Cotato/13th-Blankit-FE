import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import sadBunnyIcon from "@/assets/icons/sad-bunny.svg";
import { DockedTaskTimeBar } from "@/components/home/DockedTaskTimeBar";
import { HomeTopBar } from "@/components/home/HomeTopBar";
import { RecommendedTaskTimeCard } from "@/components/home/RecommendedTaskTimeCard";
import { WeeklyCalendar } from "@/components/home/WeeklyCalendar";
import { TodayRecommendedTasks } from "@/components/task/TodayRecommendedTasks";
import { mockTasks } from "@/mocks/tasks";

const HOME_TOP_BAR_HEIGHT = 50;

function HomeEmptyState() {
  return (
    <main className="flex min-h-[calc(100dvh-140px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] items-center justify-center px-5">
      <div className="flex flex-col items-center text-center">
        <img
          src={sadBunnyIcon}
          alt=""
          className="mb-7 h-[140px] w-[140px]"
        />

        <h1 className="text-[18px] font-bold leading-[150%] tracking-[-0.02em] text-black-100">
          아직 과업이 없어요
        </h1>

        <p className="mt-3 text-[14px] font-medium leading-[150%] tracking-[-0.02em] text-black-600">
          과업을 등록하면 지금 가장
          <br />
          중요한 일과 오늘의 권장 시간을 추천해드려요.
        </p>
      </div>
    </main>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const taskCardRef = useRef<HTMLDivElement>(null);
  const [showDockedBar, setShowDockedBar] = useState(false);

  const hasTasks = mockTasks.length > 0;
  //const hasTasks = false;
  //등록된 과업 없는 화면 테스트용

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
        const isOutsideVisibleArea = !entry.isIntersecting;
        const hasPassedTopBar =
          entry.boundingClientRect.bottom <= HOME_TOP_BAR_HEIGHT;

        setShowDockedBar(isOutsideVisibleArea && hasPassedTopBar);
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

  if (!hasTasks) {
    return (
      <>
        <HomeTopBar showRegistrationHint />
        <HomeEmptyState />
      </>
    );
  }

  return (
    <>
      <HomeTopBar />

      <main className="flex flex-col gap-5 px-5 pt-5">
        <WeeklyCalendar />

        <div ref={taskCardRef}>
          <RecommendedTaskTimeCard />
        </div>

        <TodayRecommendedTasks
          tasks={mockTasks}
          onViewAll={() => {
            navigate("/task-recommendations");
          }}
          onTaskClick={(taskId) => {
            console.log("선택한 과업:", taskId);
          }}
        />
      </main>

      {showDockedBar && <DockedTaskTimeBar />}
    </>
  );
}