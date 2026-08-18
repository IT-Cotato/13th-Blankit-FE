import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import arrowDownIcon from "@/assets/icons/task-combination/arrow-down.svg";
import checkIcon from "@/assets/icons/task-combination/check.svg";
import backIcon from "@/assets/icons/header/back.svg";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Toast } from "@/components/common/Toast";
import { TaskChip } from "@/components/task/TaskChip";
import { useTaskCombinationPlaylist } from "@/hooks/useTaskCombinationPlaylist";
import { useTaskCombinations } from "@/hooks/useTaskCombinations";
import { useToast } from "@/hooks/useToast";
import { getCombinationAccentClassName } from "@/utils/taskCombinationCategories";

interface TaskCombinationDetailPageProps {
  dailyRecommendationRefreshKey: number;
}

export function TaskCombinationDetailPage({
  dailyRecommendationRefreshKey,
}: TaskCombinationDetailPageProps) {
  const navigate = useNavigate();
  const { modeId } = useParams();

  const {
    combinations,
    loadingCombinations,
    combinationError,
  } = useTaskCombinations(
    dailyRecommendationRefreshKey,
  );

  const combination = combinations.find(
    (item) => item.id === modeId?.toUpperCase(),
  );

  const accentClassName = combination
    ? getCombinationAccentClassName(combination.accent)
    : "";

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);

  const queuedToast = useToast();
  const {
    isCombinationAdded,
    isAddingCombination,
    isDeletingCombination,
    addCombinationToPlaylist,
    deleteCombinationFromPlaylist,
  } = useTaskCombinationPlaylist({
    combination,
    onShowToast: queuedToast.showToast,
  });

  if (loadingCombinations) {
    return (
      <div className="flex min-h-[calc(100dvh-90px)] items-center justify-center px-5">
        <p className="text-[14px] font-medium text-black-500">
          과업 조합을 불러오는 중입니다.
        </p>
      </div>
    );
  }

  if (combinationError || !combination) {
    return (
      <div className="flex min-h-[calc(100dvh-90px)] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-[18px] font-semibold text-black-100">
          {combinationError ??
            "추천 모드를 찾을 수 없습니다."}
        </h1>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-5 rounded-[8px] bg-green-500 px-5 py-3 text-[14px] font-semibold text-black-900"
        >
          홈으로 이동
        </button>
      </div>
    );
  }

  const handleCombinationAction = () => {
    if (isAddingCombination || isDeletingCombination) {
      return;
    }

    if (isCombinationAdded) {
      setIsDeleteDialogOpen(true);
      return;
    }

    void addCombinationToPlaylist();
  };

  const handleDeleteCancel = () => {
    if (isDeletingCombination) {
      return;
    }

    setIsDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteCombinationFromPlaylist();
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="px-5 pb-[120px]">
        <header className="flex h-[60px] items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
            className="flex h-10 w-10 items-center justify-start"
          >
            <img
              src={backIcon}
              alt=""
              className="h-3.5 w-3"
            />
          </button>
        </header>

        <section className="flex flex-col items-center pt-5">
          <span
            className={`flex h-28 w-28 items-center justify-center rounded-[12px] ${accentClassName}`}
          >
            <img
              src={combination.icon}
              alt=""
              className="h-24 w-24"
            />
          </span>

          <h1 className="mt-4 text-[22px] font-bold text-black-100">
            {combination.name}
          </h1>

          <button
            type="button"
            disabled={
              isAddingCombination || isDeletingCombination
            }
            onClick={handleCombinationAction}
            aria-label={
              isCombinationAdded
                ? `${combination.name} 과업 삭제`
                : `${combination.name} 플레이리스트에 추가`
            }
            className="mt-5 rounded-full active:scale-95"
          >
            <img
              src={
                isCombinationAdded
                  ? checkIcon
                  : arrowDownIcon
              }
              alt=""
              className="h-[42px] w-[42px]"
            />
          </button>
        </section>

        <ul className="mt-7 flex flex-col gap-3">
          {combination.tasks.map((task) => (
            <li key={task.id}>
              <TaskChip
                title={task.title}
                memo={task.memo}
                progressRate={task.progressRate}
                priority={task.priority}
                status={task.status}
                category={task.category}
              />
            </li>
          ))}
        </ul>
      </div>

      <Toast
        message={queuedToast.message}
        variant="taskCombination"
      />

      <ConfirmModal
        open={isDeleteDialogOpen}
        title={
          "리스트에 추가된 모든 과업을\n삭제하시겠습니까?"
        }
        onCancel={handleDeleteCancel}
        onConfirm={() => {
          void handleDelete();
        }}
        submitting={isDeletingCombination}
      />
    </>
  );
}
