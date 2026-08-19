import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { MyPageDetailTopBar } from "@/components/mypage/MyPageDetailTopBar";
import { PackCategoryIcon } from "@/components/pack/PackCategoryIcon";
import { PackProgressCircle } from "@/components/pack/PackProgressCircle";
import { PackTaskNextButton } from "@/components/pack/PackTaskNextButton";
import { PackTaskPreviousButton } from "@/components/pack/PackTaskPreviousButton";
import { PackTaskProgressDetail } from "@/components/pack/PackTaskProgressDetail";
import { PackTaskTitle } from "@/components/pack/PackTaskTitle";

const DEFAULT_AVAILABLE_MINUTES = 30;
const PREVIEW_RECOMMENDED_TASK_COUNT = 3;

type SelectedDirection = "previous" | "next" | null;

function parseAvailableMinutes(value: string | null) {
  if (value === null) {
    return DEFAULT_AVAILABLE_MINUTES;
  }

  const minutes = Number(value);

  return Number.isInteger(minutes) && minutes >= 10 && minutes <= 30
    ? minutes
    : DEFAULT_AVAILABLE_MINUTES;
}

export function PackNoti() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const availableMinutes = parseAvailableMinutes(
    searchParams.get("availableMinutes"),
  );
  const [currentTaskNumber, setCurrentTaskNumber] = useState(1);
  const [selectedDirection, setSelectedDirection] =
    useState<SelectedDirection>(null);
  const selectionTimerRef = useRef<number | null>(null);

  const showDirectionSelection = (
    direction: Exclude<SelectedDirection, null>,
  ) => {
    if (selectionTimerRef.current !== null) {
      window.clearTimeout(selectionTimerRef.current);
    }

    setSelectedDirection(direction);
    selectionTimerRef.current = window.setTimeout(() => {
      setSelectedDirection(null);
      selectionTimerRef.current = null;
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (selectionTimerRef.current !== null) {
        window.clearTimeout(selectionTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-dvh bg-black-900 text-black-100">
      <MyPageDetailTopBar
        title={`${availableMinutes}분 Pack!`}
        onBack={() => navigate("/")}
        titleClassName="text-lg leading-[27px] tracking-[-0.27px]"
      />

      <main
        aria-label={`${availableMinutes}분 Pack 추천`}
        className="pt-[41px]"
      >
        <div
          aria-label={`${PREVIEW_RECOMMENDED_TASK_COUNT}개 추천 중 ${currentTaskNumber}번째 과업`}
          className="flex h-11 w-full items-center justify-between bg-black-850 px-5 py-1 font-sans font-semibold not-italic leading-[150%]"
        >
          <span className="flex items-stretch">
            <span className="inline-flex self-stretch items-center text-[18px] tracking-[-0.27px] text-black-100">
              {currentTaskNumber}
            </span>
            <span className="text-[24px] tracking-[-0.36px] text-black-700">
              /{PREVIEW_RECOMMENDED_TASK_COUNT}
            </span>
          </span>

          <div className="flex items-center overflow-hidden rounded-[4px] bg-black-750">
            <PackTaskPreviousButton
              disabled={currentTaskNumber <= 1}
              selected={selectedDirection === "previous"}
              onClick={() => {
                showDirectionSelection("previous");
                setCurrentTaskNumber((current) => Math.max(current - 1, 1));
              }}
            />
            <PackTaskNextButton
              disabled={currentTaskNumber >= PREVIEW_RECOMMENDED_TASK_COUNT}
              selected={selectedDirection === "next"}
              onClick={() => {
                showDirectionSelection("next");
                setCurrentTaskNumber((current) =>
                  Math.min(current + 1, PREVIEW_RECOMMENDED_TASK_COUNT),
                );
              }}
            />
          </div>
        </div>

        <section
          aria-label="추천 과업 진행도"
          className="relative left-1/2 mt-[103px] w-dvw -translate-x-1/2"
        >
          <PackProgressCircle progress={68}>
            <PackCategoryIcon iconKey="study" />
            <PackTaskTitle title="전공 기말 시험" />
            <PackTaskProgressDetail detail="52p 까지 진행" />
          </PackProgressCircle>
        </section>
      </main>
    </div>
  );
}
