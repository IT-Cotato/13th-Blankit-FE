import { useCallback, useEffect, useRef, useState } from "react";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { useTaskSteps } from "@/hooks/useTaskSteps";
import {
    canCompleteFeedback,
    getFeedbackCloseResult,
} from "@/utils/taskFeedback";

import { FeedbackProgressSlider } from "./FeedbackProgressSlider";
import { FeedbackStepRow } from "./FeedbackStepRow";
import { useTaskFeedback } from "@/hooks/useTaskFeedback";
import type { TaskFeedbackResponse } from "@/types/taskFeedbackApi";
import plusButtonIcon from "@/assets/icons/task-combination/plus-400-button.svg";
import xIcon from "@/assets/icons/x-black-600.svg";

interface TaskFeedbackSheetProps {
    open: boolean;
    taskId: string;
    apiTaskId: number | null;
    sessionId: number | null;
    onClose: () => void;
    onComplete: (feedback: TaskFeedbackResponse) => Promise<boolean>;
    onShowToast: (message: string) => void;
}

interface AddStepButtonProps {
    onClick: () => void;
    emphasized?: boolean;
    disabled?: boolean;
}

function AddStepButton({
    onClick,
    emphasized = false,
    disabled = false,
}: AddStepButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
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
    apiTaskId,
    sessionId,
    onClose,
    onComplete,
    onShowToast,
}: TaskFeedbackSheetProps) {
    const memoInputRef = useRef<HTMLInputElement>(null);
    const skipNextMemoBlurSaveRef = useRef(false);
    const closeInFlightRef = useRef(false);
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);
    const draft = usePlaylistStore((state) => state.feedbackDrafts[taskId]);
    const {
        isLoadingSteps,
        isUpdatingSteps,
        stepsError,
        createDefaultSteps,
        saveStepTitle,
        deleteStep,
    } = useTaskSteps({
        taskId: apiTaskId,
        feedbackTaskId: taskId,
        enabled: open,
    });
    const ensureFeedbackDraft = usePlaylistStore(
        (state) => state.ensureFeedbackDraft,
    );
    const updateFeedbackMemo = usePlaylistStore(
        (state) => state.updateFeedbackMemo,
    );
    const updateFeedbackProgress = usePlaylistStore(
        (state) => state.updateFeedbackProgress,
    );
    const addFeedbackStep = usePlaylistStore((state) => state.addFeedbackStep);
    const updateFeedbackStep = usePlaylistStore(
        (state) => state.updateFeedbackStep,
    );
    const {
        isSavingFeedback,
        feedbackError,
        hasSavedProgress,
        saveDraft,
        saveMemoDraft,
        submitFinalFeedback,
    } = useTaskFeedback({
        sessionId,
        feedbackTaskId: taskId,
        enabled: open,
    });

    useEffect(() => {
        if (open) {
            ensureFeedbackDraft(taskId);
        }
    }, [ensureFeedbackDraft, open, taskId]);

    useEffect(() => {
        if (!stepsError) {
            return;
        }

        onShowToast(stepsError);
    }, [onShowToast, stepsError]);

    useEffect(() => {
        if (!feedbackError) {
            return;
        }

        onShowToast(feedbackError);
    }, [feedbackError, onShowToast]);

    const handleClose = useCallback(async () => {
        if (isSavingFeedback || closeInFlightRef.current) {
            skipNextMemoBlurSaveRef.current = false;
            return;
        }

        closeInFlightRef.current = true;

        try {
            const closeResult = await getFeedbackCloseResult(saveDraft);

            skipNextMemoBlurSaveRef.current = false;

            if (closeResult === "close") {
                onClose();
                return;
            }

            setShowDiscardDialog(true);
        } finally {
            closeInFlightRef.current = false;
        }
    }, [isSavingFeedback, onClose, saveDraft]);

    useEffect(() => {
        if (!open || showDiscardDialog) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") {
                return;
            }

            event.preventDefault();
            void handleClose();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleClose, open, showDiscardDialog]);

    const handleComplete = async () => {
        skipNextMemoBlurSaveRef.current = false;

        if (isSavingFeedback || isUpdatingSteps) {
            return;
        }

        const submittedFeedback = await submitFinalFeedback();

        if (!submittedFeedback) {
            return;
        }

        await onComplete(submittedFeedback);
    };

    const handleMemoBlur = () => {
        if (skipNextMemoBlurSaveRef.current) {
            skipNextMemoBlurSaveRef.current = false;
            return;
        }

        void saveMemoDraft();
    };

    if (!open || !draft) {
        return null;
    }

    const hasSteps = draft.steps.length > 0;
    const canComplete = canCompleteFeedback(draft, hasSavedProgress);

    return (
        <>
            <div className="fixed sm:max-w-[641px] mx-auto inset-0 z-[55] flex items-end bg-black/60">
                <section
                    role="dialog"
                    aria-modal="true"
                    aria-label="과업 피드백"
                    className="flex max-h-[calc(100dvh-120px)] w-full flex-col overflow-hidden rounded-t-[20px] bg-black-850 shadow-[0_10px_60px_0_rgba(0,0,0,0.6)]"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                disabled={isSavingFeedback}
                                onPointerDown={() => {
                                    skipNextMemoBlurSaveRef.current = true;
                                }}
                                onClick={() => {
                                    void handleClose();
                                }}
                                aria-label="피드백 닫기"
                                className="flex h-6 w-6 items-center justify-center"
                            >
                                <img src={xIcon} alt="" className="h-3 w-3" />
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
                                    onBlur={handleMemoBlur}
                                    placeholder="3장 15p까지 함"
                                    aria-label="과업 피드백 메모"
                                    className="min-w-0 flex-1 bg-transparent px-2 text-[16px] font-medium text-black-200 outline-none placeholder:text-black-600"
                                />

                                <button
                                    type="button"
                                    disabled={isSavingFeedback}
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
                                            updateFeedbackStep(
                                                taskId,
                                                step.id,
                                                {
                                                    title,
                                                },
                                            )
                                        }
                                        onTitleBlur={(title) => {
                                            void saveStepTitle(step, title);
                                        }}
                                        onProgressChange={(progress) =>
                                            updateFeedbackStep(
                                                taskId,
                                                step.id,
                                                {
                                                    progress,
                                                    progressTouched: true,
                                                },
                                            )
                                        }
                                        onDelete={() => {
                                            void deleteStep(step);
                                        }}
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
                                        disabled={
                                            isLoadingSteps || isUpdatingSteps
                                        }
                                        onClick={() => {
                                            void createDefaultSteps();
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="shrink-0 bg-black-850 px-5 pb-5 pt-4 shadow-[0_-12px_24px_rgba(0,0,0,0.18)]">
                        <button
                            type="button"
                            onPointerDown={() => {
                                skipNextMemoBlurSaveRef.current = true;
                            }}
                            onClick={() => {
                                void handleComplete();
                            }}
                            disabled={
                                !canComplete ||
                                isSavingFeedback ||
                                isUpdatingSteps
                            }
                            className="h-[52px] w-full rounded-[8px] bg-green-500 text-[14px] font-semibold text-black-900 disabled:bg-black-800 disabled:text-black-600 disabled:font-medium"
                        >
                            완료
                        </button>
                    </div>
                </section>
            </div>

            <ConfirmModal
                open={showDiscardDialog}
                title={
                    "임시저장에 실패했습니다.\n저장하지 않고 닫으시겠습니까?"
                }
                cancelLabel="취소"
                confirmLabel="닫기"
                onCancel={() => setShowDiscardDialog(false)}
                onConfirm={() => {
                    setShowDiscardDialog(false);
                    onClose();
                }}
            />
        </>
    );
}
