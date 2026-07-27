import { useEffect, useRef } from "react";

import { usePlaylistStore } from "@/store/usePlaylistStore";
import { canCompleteFeedback } from "@/utils/taskFeedback";

import { FeedbackProgressSlider } from "./FeedbackProgressSlider";
import { FeedbackStepRow } from "./FeedbackStepRow";

interface TaskFeedbackSheetProps {
  open: boolean;
  taskId: string;
  onClose: () => void;
  onComplete: () => void;
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
      className="fixed bottom-[90px] left-0 right-0 z-[55] max-h-[calc(100dvh-120px)] overflow-y-auto rounded-t-[18px] bg-black-850 px-5 pb-5 pt-5 shadow-[0_-16px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="피드백 닫기"
          className="flex h-9 w-9 items-center justify-center text-[28px] leading-none text-black-500"
        >
          ×
        </button>
      </div>

      <div className="mt-1">
        <h2 className="text-[16px] font-semibold text-black-100">
          어디까지 진행했나요?
        </h2>

        <div className="mt-4 flex items-center gap-2 rounded-[7px] bg-black-750 p-2">
          <input
            ref={memoInputRef}
            value={draft.memo}
            onChange={(event) =>
              updateFeedbackMemo(taskId, event.target.value)
            }
            placeholder="메모 작성하기"
            aria-label="과업 피드백 메모"
            className="min-w-0 flex-1 bg-transparent px-2 text-[13px] font-medium text-black-200 outline-none placeholder:text-black-500"
          />
          <button
            type="button"
            onClick={() => memoInputRef.current?.blur()}
            className="rounded-[5px] bg-black-650 px-3 py-2 text-[12px] font-semibold text-black-300"
          >
            완료
          </button>
        </div>
      </div>

      <div className="mt-7">
        <h2 className="text-[16px] font-semibold text-black-100">
          진행한 만큼 진척도를 나타내주세요.
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
        <div className="mt-4 flex flex-col gap-3 rounded-[8px] bg-black-750 p-3">
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
        </div>
      ) : (
        <div className="mt-4 rounded-[8px] bg-black-750 px-5 py-5 text-center">
          <p className="text-[13px] font-medium leading-[160%] text-black-400">
            진행률을 나타내기 어렵다면
            <br />
            과업을 작은 단계로 나눌 수 있어요.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => splitFeedbackIntoSteps(taskId)}
        disabled={hasSteps}
        className="mx-auto mt-4 flex items-center gap-2 rounded-[6px] bg-black-650 px-4 py-3 text-[13px] font-semibold text-black-300 disabled:opacity-40"
      >
        <span aria-hidden="true" className="text-[22px]">
          +
        </span>
        단계 추가하기
      </button>

      <button
        type="button"
        onClick={onComplete}
        disabled={!canComplete}
        className="mt-5 h-[52px] w-full rounded-[8px] bg-green-500 text-[14px] font-semibold text-black-900 disabled:bg-black-750 disabled:text-black-500"
      >
        완료
      </button>
    </section>
  );
}
