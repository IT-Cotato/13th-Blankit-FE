import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { getAllRecommendations } from "@/api/recommendations";

import backIcon from "@/assets/icons/header/back.svg";

import { TopBarShell } from "@/components/layout/top-bar/TopBarShell";
import { TaskChip } from "@/components/task/TaskChip";

import type { RecommendedTaskItem } from "@/types/recommendationApi";
import type { TaskPriority } from "@/types/task";

const PRIORITY_TABS: {
  label: string;
  value: TaskPriority;
  activeClassName: string;
}[] = [
  {
    label: "우선순위 상",
    value: "HIGH",
    activeClassName:
      "bg-red-400 text-black-900",
  },
  {
    label: "우선순위 중",
    value: "MEDIUM",
    activeClassName:
      "bg-orange-400 text-black-900",
  },
  {
    label: "우선순위 하",
    value: "LOW",
    activeClassName:
      "bg-lime-400 text-black-900",
  },
];

interface TaskRecommendationsPageProps {
  refreshKey: number;
  onTaskClick: (
    taskId: number,
  ) => void;
}

export function TaskRecommendationsPage({
  refreshKey,
  onTaskClick,
}: TaskRecommendationsPageProps) {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<
    RecommendedTaskItem[]
  >([]);

  const [
    selectedPriority,
    setSelectedPriority,
  ] = useState<TaskPriority>("HIGH");

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const response =
          await getAllRecommendations();

        if (cancelled) {
          return;
        }

        setTasks(
          [...response.tasks].sort(
            (first, second) =>
              first.rankOrder -
              second.rankOrder,
          ),
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(error);
        setTasks([]);
        setErrorMessage(
          "추천 과업을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const filteredTasks = tasks.filter(
    (task) =>
      task.priority ===
      selectedPriority,
  );

  return (
    <>
      <TopBarShell>
        <div
          className="
            relative flex w-full items-center
            justify-center
          "
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="
              absolute left-0 flex h-10 w-10
              items-center justify-start px-1
              text-black-600
            "
          >
            <img
              src={backIcon}
              alt=""
              className="h-3.5 w-3"
            />
          </button>

          <h1
            className="
              text-[18px] font-semibold
              leading-[150%]
              tracking-[-0.015em]
              text-black-100
            "
          >
            과업 조합 추천
          </h1>
        </div>
      </TopBarShell>

      <div className="px-5 pt-5">
        <div
          role="tablist"
          aria-label="과업 우선순위"
          className="flex items-center gap-3"
        >
          {PRIORITY_TABS.map((tab) => {
            const isSelected =
              selectedPriority ===
              tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={
                  isSelected
                }
                onClick={() => {
                  setSelectedPriority(
                    tab.value,
                  );
                }}
                className={`
                  rounded-[6px] px-3 py-2
                  text-[14px] font-semibold
                  leading-[150%]
                  transition-colors
                  ${
                    isSelected
                      ? tab.activeClassName
                      : "bg-black-750 text-black-500"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <p className="text-[14px] font-medium text-black-500">
              추천 과업을 불러오는 중입니다.
            </p>
          </div>
        ) : errorMessage ? (
          <div className="flex min-h-60 items-center justify-center">
            <p className="text-[14px] font-medium text-red-400">
              {errorMessage}
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex min-h-60 items-center justify-center">
            <p className="text-[14px] font-medium text-black-500">
              해당 우선순위의 과업이 없습니다.
            </p>
          </div>
        ) : (
          <ul className="mt-5 flex flex-col gap-3">
            {filteredTasks.map(
              (task) => (
                <li key={task.taskId}>
                  <TaskChip
                    title={task.title}
                    priority={
                      task.priority
                    }
                    categoryColor={
                      task.categoryColor
                    }
                    categoryIconKey={
                      task.categoryIconKey
                    }
                    progressRate={
                      task.progressRate
                    }
                    onClick={() =>
                      onTaskClick(
                        task.taskId,
                      )
                    }
                  />
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </>
  );
}