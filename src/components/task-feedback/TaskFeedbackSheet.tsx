import { useEffect, useRef } from "react";

import { usePlaylistStore } from "@/store/usePlaylistStore";
import { canCompleteFeedback } from "@/utils/taskFeedback";

import { FeedbackProgressSlider } from "./FeedbackProgressSlider";
import { FeedbackStepRow } from "./FeedbackStepRow";

import plusButtonIcon from "@/assets/icons/task-combination/plus-400-button.svg";
import xIcon from "@/assets/icons/x-black-600.svg";

interface TaskFeedbackSheetProps {
  open: boolean;
  taskId: string;
  onClose: () => void;
  onComplete: () => void;
}

interface AddStepButtonProps {
  onClick: () => void;
  emphasized?: boolean;
}

function AddStepButton({
  onClick,
  emphasized = false,
}: AddStepButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[33px] w-[121px] items-center justify-center gap-2 whitespace-nowrap rounded-[6px] bg-black-750 px-3 py-1.5 text-[14px] ${
        emphasized
          ? "font-semibold text-black-600"
          : "font-medium text-black-400"
      }`}
    >
      <img
        src={plusButtonIcon}
        alt=""
        className="h-[14px] w-[14px] shrink-0"
      />
      단계 추가하기
    </button>
  );
}

export function TaskFeedbackSheet({
  open,
  taskId,
  onClose,
  onComplete,
}: TaskFeedbackSheetProps) {
  const memoInputRef = useRef<HTMLInputElement>(null);
  const draft = usePlaylistStore(
    (state) => state.feedbackDrafts[taskId],
  );
  const ensureFeedbackDraft = usePlaylistStore(
    (state) => state.ensureFeedbackDraft,
  );
  const updateFeedbackMemo = usePlaylistStore(
    (state) => state.updateFeedbackMemo,
  );
  const updateFeedbackProgress = usePlaylistStore(
    (state) => state.updateFeedbackProgress,
  );
  const splitFeedbackIntoSteps = usePlaylistStore(
    (state) => state.splitFeedbackIntoSteps,
  );
  const addFeedbackStep = usePlaylistStore(
    (state) => state.addFeedbackStep,
  );
  const updateFeedbackStep = usePlaylistStore(
    (state) => state.updateFeedbackStep,
  );
  const removeFeedbackStep = usePlaylistStore(
    (state) => state.removeFeedbackStep,
  );

  useEffect(() => {
    if (open) {
      ensureFeedbackDraft(taskId);
    }
  }, [ensureFeedbackDraft, open, taskId]);

  if (!open || !draft) {
    return null;
  }

  const hasSteps = draft.steps.length > 0;
  const canComplete = canCompleteFeedback(draft);

  return (
    <section
      aria-label="과업 피드백"
      className="fixed bottom-0 left-0 right-0 z-[55] flex max-h-[calc(100dvh-120px)] flex-col overflow-hidden rounded-t-[20px] bg-black-850 shadow-[0_10px_60px_0_rgba(0,0,0,0.6)]"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="피드백 닫기"
            className="flex h-6 w-6 items-center justify-center"
          >
            <img
              src={xIcon}
              alt=""
              className="h-3 w-3"
            />
          </button>
        </div>

        <div className="mt-1">
          <h2 className="text-[16px] font-medium text-black-100">
            어디까지 진행했나요?
          </h2>

          <div className="mt-4 flex items-center gap-2 rounded-[6px] bg-black-800 p-2">
            <input
              ref={memoInputRef}
              value={draft.memo}
              onChange={(event) =>
                updateFeedbackMemo(
                  taskId,
                  event.target.value,
                )
              }
              placeholder="3장 15p까지 함"
              aria-label="과업 피드백 메모"
              className="min-w-0 flex-1 bg-transparent px-2 text-[16px] font-medium text-black-200 outline-none placeholder:text-black-600"
            />
            <button
              type="button"
              onClick={() => memoInputRef.current?.blur()}
              className="rounded-[4px] bg-black-700 px-3 py-2 text-[14px] font-medium text-black-500"
            >
              완료
            </button>
          </div>
        </div>

        <div className="mt-7">
          <h2 className="text-[16px] font-medium leading-[150%] tracking-[-0.015em] text-black-100">
            진행한 만큼 드래그 해주세요.
          </h2>

          <div className="mt-4">
            <FeedbackProgressSlider
              value={draft.progress}
              disabled={hasSteps}
              onChange={(progress) =>
                updateFeedbackProgress(taskId, progress)
              }
              label="전체 과업 진척도"
            />
          </div>
        </div>

        {hasSteps ? (
          <div className="mt-4 flex min-h-[420px] w-full flex-col gap-3 rounded-[8px] bg-black-800 p-3">
            {draft.steps.map((step) => (
              <FeedbackStepRow
                key={step.id}
                step={step}
                onTitleChange={(title) =>
                  updateFeedbackStep(taskId, step.id, {
                    title,
                  })
                }
                onProgressChange={(progress) =>
                  updateFeedbackStep(taskId, step.id, {
                    progress,
                    progressTouched: true,
                  })
                }
                onDelete={() =>
                  removeFeedbackStep(taskId, step.id)
                }
              />
            ))}

            <div className="flex h-[57px] shrink-0 items-center justify-center p-3">
              <AddStepButton
                onClick={() => addFeedbackStep(taskId)}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex h-[147px] w-full flex-col items-center gap-4 rounded-[8px] bg-black-800 py-4">
            <div className="flex h-[42px] w-full max-w-[303px] items-center justify-center">
              <p className="text-center text-[14px] font-medium leading-[150%] tracking-[-0.015em] text-black-600">
                진행률을 나타내기 어렵다면
                <br />
                과업을 작은 단계로 나눌 수 있어요.
              </p>
            </div>

            <div className="flex h-[57px] w-[145px] items-center justify-center p-3">
              <AddStepButton
                emphasized
                onClick={() =>
                  splitFeedbackIntoSteps(taskId)
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 bg-black-850 px-5 pb-5 pt-4 shadow-[0_-12px_24px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={onComplete}
          disabled={!canComplete}
          className="h-[52px] w-full rounded-[8px] bg-green-500 text-[14px] font-semibold text-black-900 disabled:bg-black-800 disabled:text-black-600 disabled:font-medium"
        >
          완료
        </button>
      </div>
    </section>
  );
}
