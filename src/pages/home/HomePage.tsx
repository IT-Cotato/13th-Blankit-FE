import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DockedTaskTimeBar } from "@/components/home/DockedTaskTimeBar";
import { HomeTopBar } from "@/components/home/HomeTopBar";
import { RecommendedTaskTimeCard } from "@/components/home/RecommendedTaskTimeCard";
import { WeeklyCalendar } from "@/components/home/WeeklyCalendar";
import { TodayRecommendedTasks } from "@/components/task/TodayRecommendedTasks";
import { mockTasks } from "@/mocks/tasks";

const HOME_TOP_BAR_HEIGHT = 50;

export function HomePage() {
  const navigate = useNavigate();
  const taskCardRef = useRef<HTMLDivElement>(null);
  const [showDockedBar, setShowDockedBar] = useState(false);

  useEffect(() => {
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
  }, []);

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