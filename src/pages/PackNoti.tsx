import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { getThirtyMinutePackRecommendation } from "@/api/recommendations";
import { MyPageDetailTopBar } from "@/components/mypage/MyPageDetailTopBar";
import { PackExpectedProgress } from "@/components/pack/PackExpectedProgress";
import { PackProgressCircle } from "@/components/pack/PackProgressCircle";
import { PackPromptBubble } from "@/components/pack/PackPromptBubble";
import { PackTaskContent } from "@/components/pack/PackTaskContent";
import { PackTaskNextButton } from "@/components/pack/PackTaskNextButton";
import { PackTaskPreviousButton } from "@/components/pack/PackTaskPreviousButton";
import { CATEGORY_ICON_MAP } from "@/constants/category";
import type { CategoryIconKey } from "@/types/category";
import type { ThirtyMinutePackRecommendationResponse } from "@/types/recommendationApi";

const DEFAULT_AVAILABLE_MINUTES = 30;
const PACK_CAROUSEL_ITEM_GAP = 52;
const PACK_CAROUSEL_ITEM_WIDTH = 238;
const PACK_DESIGN_VIEWPORT_HEIGHT = 812;
const PACK_MIN_LAYOUT_SCALE = 0.7;

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

function resolveCategoryIconKey(value: string): CategoryIconKey {
  return value in CATEGORY_ICON_MAP
    ? (value as CategoryIconKey)
    : "study";
}

export function PackNoti() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const availableMinutes = parseAvailableMinutes(
    searchParams.get("availableMinutes"),
  );
  const isPushEntry = searchParams.get("source") === "push";
  const [recommendation, setRecommendation] =
    useState<ThirtyMinutePackRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(isPushEntry);
  const [loadError, setLoadError] = useState<string | null>(null);
  const recommendedTasks = recommendation?.tasks ?? [];
  const recommendedTaskCount = recommendedTasks.length;
  const displayedAvailableMinutes =
    recommendation?.availableMinutes ?? availableMinutes;
  const [currentTaskNumber, setCurrentTaskNumber] = useState(1);
  const displayedTaskNumber = recommendedTaskCount === 0
    ? 0
    : Math.min(currentTaskNumber, recommendedTaskCount);
  const [selectedDirection, setSelectedDirection] =
    useState<SelectedDirection>(null);
  const [showPackPrompt, setShowPackPrompt] = useState(true);
  const [layoutScale, setLayoutScale] = useState(() =>
    Math.max(
      PACK_MIN_LAYOUT_SCALE,
      Math.min(1, window.innerHeight / PACK_DESIGN_VIEWPORT_HEIGHT),
    ),
  );
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
    const updateLayoutScale = () => {
      setLayoutScale(
        Math.max(
          PACK_MIN_LAYOUT_SCALE,
          Math.min(1, window.innerHeight / PACK_DESIGN_VIEWPORT_HEIGHT),
        ),
      );
    };

    window.addEventListener("resize", updateLayoutScale);

    return () => {
      window.removeEventListener("resize", updateLayoutScale);

      if (selectionTimerRef.current !== null) {
        window.clearTimeout(selectionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isPushEntry) {
      return;
    }

    let isCancelled = false;

    void getThirtyMinutePackRecommendation(availableMinutes)
      .then((data) => {
        if (isCancelled) {
          return;
        }

        setRecommendation(data);
        setCurrentTaskNumber(1);
      })
      .catch(() => {
        if (!isCancelled) {
          setLoadError("추천 과업을 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [availableMinutes, isPushEntry]);

  if (!isPushEntry) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex h-[calc(100dvh-90px-env(safe-area-inset-bottom))] min-h-0 flex-col bg-black-900 text-black-100">
      <MyPageDetailTopBar
        title={`${displayedAvailableMinutes}분 Pack!`}
        onBack={() => navigate("/")}
        titleClassName="text-lg leading-[27px] tracking-[-0.27px]"
      />

      <main
        aria-label={`${displayedAvailableMinutes}분 Pack 추천`}
        className="flex min-h-0 flex-1 flex-col"
        style={{ paddingTop: 41 * layoutScale }}
      >
        <div
          aria-label={`${recommendedTaskCount}개 추천 중 ${displayedTaskNumber}번째 과업`}
          className="relative flex h-11 w-full items-center justify-between px-5 py-1 font-sans font-semibold not-italic leading-[150%]"
        >
          <img
            src="/mypage/pack.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[37.452px] right-[22px] z-[60] h-[58.548px] w-10"
          />
          {showPackPrompt ? (
            <div className="absolute bottom-[51px] right-[80px] z-[60]">
              <PackPromptBubble
                minutes={displayedAvailableMinutes}
                onClose={() => setShowPackPrompt(false)}
              />
            </div>
          ) : null}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[70] bg-black-850"
          />

          <span className="relative z-[80] flex items-stretch">
            <span className="inline-flex self-stretch items-center text-[18px] tracking-[-0.27px] text-black-100">
              {displayedTaskNumber}
            </span>
            <span className="text-[24px] tracking-[-0.36px] text-black-700">
              /{recommendedTaskCount}
            </span>
          </span>

          <div className="relative z-[80]">
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
                disabled={currentTaskNumber >= recommendedTaskCount}
                selected={selectedDirection === "next"}
                onClick={() => {
                  showDirectionSelection("next");
                  setCurrentTaskNumber((current) =>
                    Math.min(current + 1, recommendedTaskCount),
                  );
                }}
              />
            </div>
          </div>
        </div>

        <section
          aria-label="추천 과업 진행도"
          className="relative left-1/2 flex min-h-0 w-dvw flex-1 -translate-x-1/2 items-center overflow-hidden"
        >
          {isLoading ? (
            <p className="w-full text-center text-[14px] text-black-600">
              추천 과업을 불러오는 중입니다.
            </p>
          ) : loadError ? (
            <p role="alert" className="w-full text-center text-[14px] text-red-400">
              {loadError}
            </p>
          ) : recommendedTaskCount === 0 ? (
            <p className="w-full text-center text-[14px] text-black-600">
              지금 추천할 수 있는 과업이 없습니다.
            </p>
          ) : (
            <div
            className="flex w-max transition-transform duration-300 ease-out"
            style={{
              columnGap: PACK_CAROUSEL_ITEM_GAP * layoutScale,
              transform: `translateX(calc(50dvw - ${(PACK_CAROUSEL_ITEM_WIDTH * layoutScale) / 2}px - ${(displayedTaskNumber - 1) * (PACK_CAROUSEL_ITEM_WIDTH + PACK_CAROUSEL_ITEM_GAP) * layoutScale}px))`,
            }}
          >
            {recommendedTasks.map((task, index) => (
              <article
                key={task.taskId}
                aria-label={`${index + 1}번째 추천 과업`}
                aria-hidden={index !== displayedTaskNumber - 1}
                className="flex shrink-0 flex-col items-center"
                style={{ width: PACK_CAROUSEL_ITEM_WIDTH * layoutScale }}
              >
                <PackProgressCircle
                  progress={task.currentProgressRate}
                  scale={layoutScale}
                >
                  <PackTaskContent
                    categoryIconKey={resolveCategoryIconKey(task.categoryIconKey)}
                    categoryName={task.categoryName}
                    title={task.title}
                    progressDetail={
                      task.memo?.trim() || `${task.currentProgressRate}% 진행`
                    }
                  />
                </PackProgressCircle>
                <div
                  className="flex w-full justify-center"
                  style={{
                    height: 34 * layoutScale,
                    marginTop: 51 * layoutScale,
                  }}
                >
                  <div
                    className="origin-top"
                    style={{ transform: `scale(${layoutScale})` }}
                  >
                    <PackExpectedProgress
                      minutes={displayedAvailableMinutes}
                      increasePercent={Math.round(task.expectedProgressIncrease)}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </section>
      </main>
    </div>
  );
}
