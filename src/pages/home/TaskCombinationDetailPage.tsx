import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import arrowDownIcon from "@/assets/icons/task-combination/arrow-down.svg";
import checkIcon from "@/assets/icons/task-combination/check.svg";
import backIcon from "@/assets/icons/header/back.svg";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Toast } from "@/components/task-combination/Toast";
import { TaskChip } from "@/components/task/TaskChip";
import { getTaskCombination } from "@/mocks/taskCombinations";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { getCombinationAccentClassName } from "@/utils/taskCombinationCategories";

const QUEUED_TOAST_DURATION_MS = 3000;

export function TaskCombinationDetailPage() {
  const navigate = useNavigate();
  const { modeId } = useParams();

  const combination = getTaskCombination(modeId ?? "");

  const accentClassName = combination
    ? getCombinationAccentClassName(combination.accent)
    : "";

  const playlist = usePlaylistStore(
    (state) => state.playlist,
  );

  const addCombination = usePlaylistStore(
    (state) => state.addCombination,
  );

  const removeCombination = usePlaylistStore(
    (state) => state.removeCombination,
  );

  const isAdded = usePlaylistStore((state) =>
    combination
      ? state.isCombinationAdded(combination.id)
      : false,
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [showQueuedToast, setShowQueuedToast] =
    useState(false);

  const deleteLockRef = useRef(false);

  const toastTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(
    () => () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    },
    [],
  );

  if (!combination) {
    return (
      <div className="flex min-h-[calc(100dvh-90px)] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-[18px] font-semibold text-black-100">
          추천 모드를 찾을 수 없습니다.
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
    if (isAdded) {
      deleteLockRef.current = false;
      setIsDeleting(false);
      setIsDeleteDialogOpen(true);
      return;
    }

    const hadPlaylist = playlist.length > 0;

    addCombination(combination);

    if (!hadPlaylist) {
      return;
    }

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setShowQueuedToast(true);

    toastTimerRef.current = setTimeout(() => {
      setShowQueuedToast(false);
      toastTimerRef.current = null;
    }, QUEUED_TOAST_DURATION_MS);
  };

  const handleDeleteCancel = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteLockRef.current) {
      return;
    }

    deleteLockRef.current = true;
    setIsDeleting(true);

    removeCombination(combination.id);

    setIsDeleteDialogOpen(false);
    setShowQueuedToast(false);
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

          <p className="mt-1 text-[13px] font-medium text-black-600">
            {combination.description}
          </p>

          <button
            type="button"
            onClick={handleCombinationAction}
            aria-label={
              isAdded
                ? `${combination.name} 과업 삭제`
                : `${combination.name} 플레이리스트에 추가`
            }
            className="mt-5 rounded-full active:scale-95"
          >
            <img
              src={isAdded ? checkIcon : arrowDownIcon}
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
                progressRate={task.progressRate}
                priority={task.priority}
                status={task.status}
                category={task.category}
              />
            </li>
          ))}
        </ul>
      </div>

      {showQueuedToast && (
        <Toast message="할 일이 다음에 재생됩니다." />
      )}

      <ConfirmModal
        open={isDeleteDialogOpen}
        title={"리스트에서 모든 과업을\n삭제하시겠습니까?"}
        onCancel={handleDeleteCancel}
        onConfirm={handleDelete}
        submitting={isDeleting}
      />
    </>
  );
}
