import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TaskChip } from "@/components/task/TaskChip";
import { TopBarShell } from "@/components/layout/top-bar/TopBarShell";

import { mockTasks } from "@/mocks/tasks";

import backIcon from "@/assets/icons/header/back.svg";

import type { TaskPriority } from "@/types/task";

const PRIORITY_TABS: {
  label: string;
  value: TaskPriority;
  activeClassName: string;
}[] = [
  {
    label: "우선순위 상",
    value: "HIGH",
    activeClassName: "bg-red-400 text-black-900",
  },
  {
    label: "우선순위 중",
    value: "MEDIUM",
    activeClassName: "bg-orange-400 text-black-900",
  },
  {
    label: "우선순위 하",
    value: "LOW",
    activeClassName: "bg-lime-400 text-black-900",
  },
];

export function TaskRecommendationsPage() {
  const navigate = useNavigate();

  const [selectedPriority, setSelectedPriority] =
    useState<TaskPriority>("HIGH");

  const filteredTasks = mockTasks.filter(
    (task) => task.priority === selectedPriority,
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
              leading-[150%] tracking-[-0.015em]
              text-black-100
            "
          >
            과업 조합 추천
          </h1>
        </div>
      </TopBarShell>

      <main className="px-5 pt-5">
        <div
          role="tablist"
          aria-label="과업 우선순위"
          className="flex items-center gap-3"
        >
          {PRIORITY_TABS.map((tab) => {
            const isSelected =
              selectedPriority === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedPriority(tab.value);
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

        <ul className="mt-5 flex flex-col gap-3">
          {filteredTasks.map((task) => (
            <li key={task.taskId}>
              <TaskChip
                title={task.title}
                lastMemo={task.lastMemo}
                progressRate={task.progressRate}
                priority={task.priority}
                status={task.status}
                onClick={() => {
                  console.log(
                    "선택한 과업:",
                    task.taskId,
                  );
                }}
              />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}