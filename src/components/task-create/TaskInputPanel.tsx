import type { RefObject } from "react";

import arrowRightIcon from "@/assets/icons/arrow/arrow-pointing-right.svg";
import arrowRightWhiteIcon from "@/assets/icons/arrow/arrow-pointing-right-white.svg";
import calendarIcon from "@/assets/icons/bottom-nav/calendar-green.svg";
import alarmIcon from "@/assets/icons/task/alarm-icon.svg";
import categoryIcon from "@/assets/icons/task/category_icon.svg";

import { CategoryIconBadge } from "@/components/category/CategoryIconBadge";
import { TaskOptionButton } from "@/components/task-create/TaskOptionButton";
import { useDragScroll } from "@/components/task-create/hooks/useDragScroll";
import { getCategoryPresentation } from "@/constants/category";
import { useVisualViewport } from "@/hooks/useVisualViewport";

import type { AlarmOption } from "@/components/task-create/alarm/alarmOptions";
import type { Category } from "@/types/category";

interface TaskInputPanelProps {
  visible: boolean;
  editing: boolean;
  title: string;
  canContinue: boolean;
  dateLabel: string;
  category: Category | null;
  alarm: AlarmOption;
  inputRef: RefObject<HTMLInputElement | null>;
  onTitleChange: (title: string) => void;
  onContinue: () => void;
  onOpenDate: () => void;
  onOpenCategory: () => void;
  onOpenAlarm: () => void;
}

export function TaskInputPanel({
  visible,
  editing,
  title,
  canContinue,
  dateLabel,
  category,
  alarm,
  inputRef,
  onTitleChange,
  onContinue,
  onOpenDate,
  onOpenCategory,
  onOpenAlarm,
}: TaskInputPanelProps) {
  const { scrollerRef, dragHandlers } = useDragScroll();
  const { keyboardInset } = useVisualViewport();
  const categoryPresentation = category
    ? getCategoryPresentation(category)
    : null;

  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-x-0 bottom-0 z-[69] bg-black-850 transition-opacity ${
          visible && keyboardInset > 0
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{ height: keyboardInset }}
      />

    <section
      role="dialog"
      aria-modal="true"
      aria-label={editing ? "과업 수정" : "과업 추가"}
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-[70] min-h-[150px] rounded-t-[24px] bg-black-850 px-5 pb-5 pt-6 transition-opacity ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{ bottom: keyboardInset }}
    >
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={title}
          aria-label="과업명"
          placeholder="할 일을 입력하세요."
          onChange={(event) => onTitleChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canContinue) {
              onContinue();
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-[18px] font-semibold leading-[150%] text-black-100 outline-none placeholder:text-black-200"
        />

        <button
          type="button"
          aria-label="다음"
          disabled={!canContinue}
          onClick={onContinue}
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img
            src={canContinue ? arrowRightWhiteIcon : arrowRightIcon}
            alt=""
            className="h-[42px] w-[42px]"
          />
        </button>
      </div>

      <div
        ref={scrollerRef}
        {...dragHandlers}
        className="mt-5 w-full max-w-full cursor-grab touch-pan-y overflow-x-scroll overflow-y-hidden overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max min-w-full gap-3">
          <TaskOptionButton
            icon={
              <img
                src={calendarIcon}
                alt=""
                className="h-4 w-4 shrink-0"
              />
            }
            onClick={onOpenDate}
          >
            <span>{dateLabel}</span>
          </TaskOptionButton>

          <TaskOptionButton
            icon={
              categoryPresentation ? (
                <CategoryIconBadge
                  icon={categoryPresentation.icon}
                  color={categoryPresentation.color}
                  size={16}
                  withBackground={false}
                />
              ) : (
                <img
                  src={categoryIcon}
                  alt=""
                  className="h-4 w-4 shrink-0"
                />
              )
            }
            onClick={onOpenCategory}
            className="max-w-[240px]"
          >
            <span className="min-w-0 truncate">
              {category?.categoryName ?? "카테고리"}
            </span>
          </TaskOptionButton>

          <TaskOptionButton
            icon={
              <img src={alarmIcon} alt="" className="h-4 w-4 shrink-0" />
            }
            onClick={onOpenAlarm}
          >
            <span>{alarm} 알림</span>
          </TaskOptionButton>
        </div>
      </div>
    </section>
    </>
  );
}
