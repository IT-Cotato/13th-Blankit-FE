import { forwardRef, useImperativeHandle, useRef } from "react";

import arrowRightIcon from "@/assets/icons/arrow/arrow-pointing-right.svg";
import calendarIcon from "@/assets/icons/bottom-nav/calendar-green.svg";
import alarmIcon from "@/assets/icons/task/alarm-icon.svg";
import categoryIcon from "@/assets/icons/task/category_icon.svg";

import { AlarmSelectionSheet } from "@/components/task-create/alarm/AlarmSelectionSheet";
import { useAlarmFlow } from "@/components/task-create/alarm/useAlarmFlow";
import { CategoryDeleteModal } from "@/components/task-create/category/CategoryDeleteModal";
import { CategoryFormSheet } from "@/components/task-create/category/CategoryFormSheet";
import { CategoryIconBadge } from "@/components/task-create/category/CategoryIconBadge";
import { CategoryManagerSheet } from "@/components/task-create/category/CategoryManagerSheet";
import { useCategoryFlow } from "@/components/task-create/category/useCategoryFlow";
import { DateSelectionSheet } from "@/components/task-create/date/DateSelectionSheet";
import { formatDeadline } from "@/components/task-create/date/dateUtils";
import { useDateFlow } from "@/components/task-create/date/useDateFlow";

import { getCategoryPresentation } from "@/constants/category";

export interface TaskCreateComposerHandle {
  focus: () => void;
}

interface TaskCreateComposerProps {
  title: string;
  onTitleChange: (title: string) => void;
  onClose: () => void;
  onNext: () => void;
}

export const TaskCreateComposer = forwardRef<
  TaskCreateComposerHandle,
  TaskCreateComposerProps
>(function TaskCreateComposer(
  {
    title,
    onTitleChange,
    onClose,
    onNext,
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const chipScrollerRef = useRef<HTMLDivElement>(null);
  const chipDragRef = useRef({
    pointerId: -1,
    startX: 0,
    scrollLeft: 0,
    dragged: false,
  });

  function focusTaskInput() {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  const categoryFlow = useCategoryFlow({
    onReturnToComposer: focusTaskInput,
  });
  const alarmFlow = useAlarmFlow({
    onReturnToComposer: focusTaskInput,
  });
  const dateFlow = useDateFlow({
    onReturnToComposer: focusTaskInput,
  });
  const isComposerVisible =
    categoryFlow.view === "composer" &&
    alarmFlow.view === "composer" &&
    !dateFlow.open;
  const canContinue = title.trim().length > 0;
  const selectedCategoryPresentation = categoryFlow.selectedCategory
    ? getCategoryPresentation(categoryFlow.selectedCategory)
    : null;

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
  }));

  return (
    <>
      <button
        type="button"
        aria-label="과업 입력 닫기"
        onClick={onClose}
        className="fixed inset-0 z-[60] cursor-default bg-black/80"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="과업 추가"
        aria-hidden={!isComposerVisible}
        className={`fixed inset-x-0 bottom-0 z-[70] min-h-[150px] rounded-t-[24px] bg-black-850 px-5 pb-5 pt-6 transition-opacity ${
          isComposerVisible
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={title}
            aria-label="과업명"
            placeholder="할 일을 입력하세요."
            onChange={(event) => onTitleChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && canContinue) {
                onNext();
              }
            }}
            className="min-w-0 flex-1 bg-transparent text-[18px] font-semibold leading-[150%] text-black-100 outline-none placeholder:text-black-200"
          />

          <button
            type="button"
            aria-label="다음"
            disabled={!canContinue}
            onClick={onNext}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            <img
              src={arrowRightIcon}
              alt=""
              className="h-[42px] w-[42px]"
            />
          </button>
        </div>

        <div
          ref={chipScrollerRef}
          onPointerDown={(event) => {
            const scroller = chipScrollerRef.current;

            if (!scroller) {
              return;
            }

            chipDragRef.current = {
              pointerId: event.pointerId,
              startX: event.clientX,
              scrollLeft: scroller.scrollLeft,
              dragged: false,
            };
            scroller.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const scroller = chipScrollerRef.current;
            const drag = chipDragRef.current;

            if (!scroller || drag.pointerId !== event.pointerId) {
              return;
            }

            const distance = drag.startX - event.clientX;

            if (Math.abs(distance) > 4) {
              drag.dragged = true;
            }

            scroller.scrollLeft = drag.scrollLeft + distance;
          }}
          onPointerUp={(event) => {
            const scroller = chipScrollerRef.current;

            if (
              scroller?.hasPointerCapture(event.pointerId)
            ) {
              scroller.releasePointerCapture(event.pointerId);
            }

            chipDragRef.current.pointerId = -1;
            window.setTimeout(() => {
              chipDragRef.current.dragged = false;
            }, 0);
          }}
          onClickCapture={(event) => {
            if (chipDragRef.current.dragged) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          className="mt-5 w-full max-w-full cursor-grab overflow-x-scroll overflow-y-hidden overscroll-x-contain pb-1 touch-pan-y [-webkit-overflow-scrolling:touch] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max min-w-full gap-3">
            <button
              type="button"
              onClick={dateFlow.openDateSheet}
              className="flex h-12 shrink-0 items-center gap-2 rounded-[6px] bg-black-800 px-4 text-[14px] font-medium text-black-100"
            >
              <img src={calendarIcon} alt="" className="h-4 w-4 shrink-0" />
              <span>
                {dateFlow.selectedDate
                  ? formatDeadline(dateFlow.selectedDate)
                  : "날짜 선택"}
              </span>
            </button>

            <button
              type="button"
              onClick={categoryFlow.openCategories}
              className="flex h-12 max-w-[240px] shrink-0 items-center gap-2 rounded-[6px] bg-black-800 px-4 text-[14px] font-medium text-black-100"
            >
              {selectedCategoryPresentation ? (
                <CategoryIconBadge
                  icon={selectedCategoryPresentation.icon}
                  color={selectedCategoryPresentation.color}
                  size={16}
                  withBackground={false}
                />
              ) : (
                <img
                  src={categoryIcon}
                  alt=""
                  className="h-4 w-4 shrink-0"
                />
              )}
              <span className="min-w-0 truncate">
                {categoryFlow.selectedCategory?.categoryName ?? "카테고리"}
              </span>
            </button>

            <button
              type="button"
              onClick={alarmFlow.openAlarms}
              className="flex h-12 shrink-0 items-center gap-2 rounded-[6px] bg-black-800 px-4 text-[14px] font-medium text-black-100"
            >
              <img src={alarmIcon} alt="" className="h-4 w-4 shrink-0" />
              <span>{alarmFlow.selectedAlarm} 알림</span>
            </button>
          </div>
        </div>
      </section>

      {categoryFlow.view === "category-list" && (
        <CategoryManagerSheet
          categories={categoryFlow.categories}
          selectedCategoryId={
            categoryFlow.selectedCategory?.categoryId ?? null
          }
          editable={categoryFlow.editable}
          loading={categoryFlow.loading}
          onBack={categoryFlow.backToComposer}
          onStartCreate={categoryFlow.startCreate}
          onToggleEdit={categoryFlow.toggleEditable}
          onSelect={categoryFlow.selectCategory}
          onStartUpdate={categoryFlow.startUpdate}
          onRequestDelete={categoryFlow.requestDelete}
        />
      )}

      {categoryFlow.view === "category-form" && (
        <CategoryFormSheet
          key={`${categoryFlow.formMode}-${
            categoryFlow.editingCategory?.categoryId ?? "new"
          }`}
          mode={categoryFlow.formMode}
          initialName={categoryFlow.editingCategory?.categoryName}
          initialColor={categoryFlow.editingCategory?.color}
          initialIconKey={categoryFlow.editingCategory?.iconKey}
          colors={categoryFlow.availableColors}
          submitting={categoryFlow.submitting}
          onBack={categoryFlow.backToList}
          onSubmit={categoryFlow.submitCategory}
        />
      )}

      {alarmFlow.view === "alarm-list" && (
        <AlarmSelectionSheet
          selectedAlarm={alarmFlow.selectedAlarm}
          onSelect={alarmFlow.selectAlarm}
        />
      )}

      {dateFlow.open && (
        <DateSelectionSheet
          initialDate={dateFlow.selectedDate}
          onBack={dateFlow.closeDateSheet}
          onConfirm={dateFlow.confirmDate}
        />
      )}

      <CategoryDeleteModal
        open={categoryFlow.pendingDeleteCategory !== null}
        isSubmitting={categoryFlow.submitting}
        onCancel={categoryFlow.cancelDelete}
        onConfirm={categoryFlow.confirmDelete}
      />

      {categoryFlow.errorMessage && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[110] -translate-x-1/2 whitespace-nowrap rounded-[6px] border border-black-800 bg-black-850 px-4 py-2 text-[12px] font-medium text-black-200"
        >
          {categoryFlow.errorMessage}
        </div>
      )}
    </>
  );
});
