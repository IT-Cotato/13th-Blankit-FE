import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import selectIcon from "@/assets/icons/select-button-650.svg";

import {
  DAY_OF_MONTH_VALUES,
  MONTH_VALUES,
  WEEKDAY_VALUES,
} from "./repeatTypes";

import type {
  RepeatDay,
  RepeatPattern,
  RepeatSettingsDraft,
  Weekday,
} from "./repeatTypes";

interface RepeatSettingsFormProps {
  settings: RepeatSettingsDraft;
  onChange: (settings: RepeatSettingsDraft) => void;
  onSelectStartDate: () => void;
  onSelectEndDate: () => void;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS: Array<{ value: Weekday; label: string }> =
  WEEKDAY_VALUES.map((value, index) => ({
    value,
    label: WEEKDAY_LABELS[index],
  }));
const MONTH_DAYS: readonly RepeatDay[] = [
  ...DAY_OF_MONTH_VALUES,
  "last",
];
const REPEAT_TYPES: Array<{
  value: RepeatPattern["type"];
  label: string;
}> = [
  { value: "weekly", label: "매주" },
  { value: "monthly", label: "매월" },
  { value: "yearly", label: "매년" },
];

function formatDate(date: Date | null, emptyLabel: string) {
  if (!date) {
    return emptyLabel;
  }

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}

function createPattern(type: RepeatPattern["type"]): RepeatPattern {
  switch (type) {
    case "weekly":
      return { type, weekdays: [] };
    case "monthly":
      return { type, days: [] };
    case "yearly":
      return { type, month: null, days: [] };
  }
}

interface RepeatTypeSelectProps {
  value: RepeatPattern["type"];
  onChange: (value: RepeatPattern["type"]) => void;
}

function RepeatTypeSelect({
  value,
  onChange,
}: RepeatTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = REPEAT_TYPES.findIndex(
    (option) => option.value === value,
  );
  const selectedLabel =
    REPEAT_TYPES[selectedIndex]?.label ?? "";

  function openMenu(initialIndex = selectedIndex) {
    if (!containerRef.current) {
      return;
    }

    const buttonRect = containerRef.current.getBoundingClientRect();
    setMenuPosition({
      top: buttonRect.top - 113,
      left: buttonRect.right - 100,
    });
    setFocusedIndex(Math.max(initialIndex, 0));
    setOpen(true);
  }

  function selectOption(index: number) {
    const option = REPEAT_TYPES[index];

    if (!option) {
      return;
    }

    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeOnOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function closeOnViewportChange() {
      setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("resize", closeOnViewportChange);
    window.addEventListener("scroll", closeOnViewportChange, true);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("resize", closeOnViewportChange);
      window.removeEventListener("scroll", closeOnViewportChange, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, open]);

  return (
    <div ref={containerRef} className="relative h-8 w-[68px]">
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label="반복 유형"
            style={menuPosition}
            onKeyDown={(event) => {
              switch (event.key) {
                case "ArrowDown":
                  event.preventDefault();
                  setFocusedIndex(
                    (current) => (current + 1) % REPEAT_TYPES.length,
                  );
                  break;
                case "ArrowUp":
                  event.preventDefault();
                  setFocusedIndex(
                    (current) =>
                      (current - 1 + REPEAT_TYPES.length) %
                      REPEAT_TYPES.length,
                  );
                  break;
                case "Home":
                  event.preventDefault();
                  setFocusedIndex(0);
                  break;
                case "End":
                  event.preventDefault();
                  setFocusedIndex(REPEAT_TYPES.length - 1);
                  break;
                case "Enter":
                case " ":
                  event.preventDefault();
                  selectOption(focusedIndex);
                  break;
                case "Escape":
                  event.preventDefault();
                  setOpen(false);
                  triggerRef.current?.focus();
                  break;
              }
            }}
            className="fixed z-[100] h-[105px] w-[100px] overflow-hidden rounded-[6px] bg-black-750 shadow-[0_10px_60px_rgba(0,0,0,0.6)]"
          >
            {REPEAT_TYPES.map((option, index) => (
              <button
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                tabIndex={focusedIndex === index ? 0 : -1}
                onClick={() => selectOption(index)}
                className={`flex h-[35px] w-full items-center justify-center text-[14px] leading-[21px] font-medium tracking-[-0.015em] ${
                  option.value === value
                    ? "text-black-200"
                    : "text-black-650"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>,
          document.body,
        )}

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            openMenu();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu(
              event.key === "ArrowUp"
                ? REPEAT_TYPES.length - 1
                : selectedIndex,
            );
          } else if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
          }
        }}
        className="flex h-8 w-full items-center justify-between rounded-[5px] bg-black-750 px-2 text-[14px] leading-[21px] font-medium tracking-[-0.015em] text-black-300"
      >
        <span>{selectedLabel}</span>
        <img
          src={selectIcon}
          alt=""
          className={`h-[7px] w-3 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}

interface SelectionButtonProps {
  selected: boolean;
  label: string;
  onClick: () => void;
  transparent?: boolean;
  wide?: boolean;
}

function SelectionButton({
  selected,
  label,
  onClick,
  transparent = false,
  wide = false,
}: SelectionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-8 min-w-0 items-center justify-center whitespace-nowrap rounded-[5px] px-1 text-[11px] font-medium ${
        wide ? "col-span-2" : ""
      } ${
        selected
          ? "bg-green-500 text-black-900"
          : transparent
            ? "bg-transparent text-black-400"
            : "bg-black-700 text-black-300"
      }`}
    >
      {label}
    </button>
  );
}

interface DaySelectionGridProps {
  selectedDays: RepeatDay[];
  showWeekdays?: boolean;
  onToggle: (day: RepeatDay) => void;
}

function DaySelectionGrid({
  selectedDays,
  showWeekdays = false,
  onToggle,
}: DaySelectionGridProps) {
  return (
    <>
      {showWeekdays && (
        <div className="mb-2 grid h-7 grid-cols-7 gap-2">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday.value}
              className="flex items-center justify-center text-[10px] font-medium text-black-500"
            >
              {weekday.label}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {MONTH_DAYS.map((day) => (
          <SelectionButton
            key={day}
            label={day === "last" ? "마지막 날" : `${day}`}
            selected={selectedDays.includes(day)}
            wide={day === "last"}
            onClick={() => onToggle(day)}
          />
        ))}
      </div>
    </>
  );
}

export function RepeatSettingsForm({
  settings,
  onChange,
  onSelectStartDate,
  onSelectEndDate,
}: RepeatSettingsFormProps) {
  const { pattern } = settings;

  return (
    <div className="mt-5 rounded-[10px] bg-black-800 p-3">
      <div className="flex h-8 items-center justify-between">
        <span className="text-[12px] font-medium text-black-300">
          반복 유형
        </span>
        <RepeatTypeSelect
          value={pattern.type}
          onChange={(type) =>
            onChange({
              ...settings,
              pattern: createPattern(type),
            })
          }
        />
      </div>

      {pattern.type === "weekly" && (
        <div className="mt-3 grid grid-cols-7 gap-2 rounded-[8px] bg-black-750 p-2">
          {WEEKDAYS.map((weekday) => (
            <SelectionButton
              key={weekday.value}
              label={weekday.label}
              selected={pattern.weekdays.includes(weekday.value)}
              transparent
              onClick={() =>
                onChange({
                  ...settings,
                  pattern: {
                    type: "weekly",
                    weekdays: toggleValue(
                      pattern.weekdays,
                      weekday.value,
                    ),
                  },
                })
              }
            />
          ))}
        </div>
      )}

      {pattern.type === "monthly" && (
        <div className="mt-3 rounded-[8px] bg-black-750 p-3">
          <p className="mb-3 text-[12px] font-medium text-black-300">
            일 선택
          </p>
          <DaySelectionGrid
            selectedDays={pattern.days}
            showWeekdays
            onToggle={(day) =>
              onChange({
                ...settings,
                pattern: {
                  type: "monthly",
                  days: toggleValue(pattern.days, day),
                },
              })
            }
          />
        </div>
      )}

      {pattern.type === "yearly" && (
        <>
          <div className="mt-3 rounded-[8px] bg-black-750 p-3">
            <p className="mb-3 text-[12px] font-medium text-black-300">
              월 선택
            </p>
            <div className="grid grid-cols-7 gap-2">
              {MONTH_VALUES.map((month) => (
                <SelectionButton
                  key={month}
                  label={`${month + 1}`}
                  selected={pattern.month === month}
                  onClick={() =>
                    onChange({
                      ...settings,
                      pattern: {
                        ...pattern,
                        month,
                      },
                    })
                  }
                />
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-[8px] bg-black-750 p-3">
            <p className="mb-3 text-[12px] font-medium text-black-300">
              일 선택
            </p>
            <DaySelectionGrid
              selectedDays={pattern.days}
              onToggle={(day) =>
                onChange({
                  ...settings,
                  pattern: {
                    ...pattern,
                    days: toggleValue(pattern.days, day),
                  },
                })
              }
            />
          </div>
        </>
      )}

      <div className="mt-3 flex flex-col gap-2">
        <button
          type="button"
          onClick={onSelectStartDate}
          className="flex h-9 items-center justify-between rounded-[5px] px-2 text-[12px]"
        >
          <span className="font-medium text-black-300">시작 날짜</span>
          <span className="flex h-8 items-center gap-2 rounded-[5px] bg-black-750 px-2 font-medium text-black-400">
            {formatDate(settings.startDate, "선택")}
            <img src={selectIcon} alt="" className="h-[7px] w-3" />
          </span>
        </button>
        <button
          type="button"
          disabled={!settings.startDate}
          onClick={onSelectEndDate}
          className="flex h-9 items-center justify-between rounded-[5px] px-2 text-[12px] disabled:cursor-not-allowed"
        >
          <span className="font-medium text-black-300">종료 날짜</span>
          <span
            className={`flex h-8 items-center gap-2 rounded-[5px] bg-black-750 px-2 font-medium text-black-400 ${
              settings.startDate ? "" : "opacity-40"
            }`}
          >
            {formatDate(settings.endDate, "선택")}
            <img src={selectIcon} alt="" className="h-[7px] w-3" />
          </span>
        </button>
      </div>
    </div>
  );
}
