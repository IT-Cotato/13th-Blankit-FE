import { useEffect, useId, useMemo, useRef, useState } from "react";

interface MonthYearPickerProps {
  year: number;
  month: number;
  minMonth: Date;
  maxMonth: Date;
  onChange: (year: number, month: number) => void;
}

interface WheelColumnProps {
  ariaLabel: string;
  values: number[];
  selectedValue: number;
  formatValue: (value: number) => string;
  onSelect: (value: number) => void;
}

const ITEM_HEIGHT = 32;
const SETTLE_DELAY_MS = 80;
const ROTATION_BY_DISTANCE = [0, 24.967, 30.205, 33.409];
const TEXT_HEIGHT_BY_DISTANCE = [30, 23, 17, 11];
const CELL_HEIGHT_BY_DISTANCE = [32, 27, 24, 23];
const CENTER_OFFSET_BY_DISTANCE = [0, 2.5, 9, 17.5];

function interpolateByDistance(values: number[], distance: number) {
  const absoluteDistance = Math.min(Math.abs(distance), 3);
  const lowerDistance = Math.floor(absoluteDistance);
  const upperDistance = Math.ceil(absoluteDistance);
  const progress = absoluteDistance - lowerDistance;
  const lowerValue = values[lowerDistance] ?? values[0] ?? 0;
  const upperValue = values[upperDistance] ?? lowerValue;

  return lowerValue + (upperValue - lowerValue) * progress;
}

function getRotation(distance: number) {
  return Math.sign(distance) * interpolateByDistance(ROTATION_BY_DISTANCE, distance);
}

function WheelColumn({
  ariaLabel,
  values,
  selectedValue,
  formatValue,
  onSelect,
}: WheelColumnProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const optionIdPrefix = useId();
  const [scrollIndex, setScrollIndex] = useState(() =>
    Math.max(0, values.indexOf(selectedValue)),
  );
  const selectedIndex = Math.max(0, values.indexOf(selectedValue));

  useEffect(() => {
    const nextIndex = values.indexOf(selectedValue);

    if (nextIndex >= 0 && listRef.current) {
      listRef.current.scrollTo({
        top: nextIndex * ITEM_HEIGHT,
        behavior: "smooth",
      });
    }
  }, [selectedValue, values]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  function selectIndex(index: number) {
    const boundedIndex = Math.max(0, Math.min(values.length - 1, index));
    const nextValue = values[boundedIndex];

    if (nextValue !== undefined) {
      onSelect(nextValue);
    }
  }

  function settleSelection() {
    const list = listRef.current;

    if (!list) {
      return;
    }

    const index = Math.max(
      0,
      Math.min(values.length - 1, Math.round(list.scrollTop / ITEM_HEIGHT)),
    );

    list.scrollTo({
      top: index * ITEM_HEIGHT,
      behavior: "smooth",
    });
    selectIndex(index);
  }

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label={ariaLabel}
      aria-activedescendant={`${optionIdPrefix}-${selectedValue}`}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          selectIndex(selectedIndex - 1);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          selectIndex(selectedIndex + 1);
        } else if (event.key === "Home") {
          event.preventDefault();
          selectIndex(0);
        } else if (event.key === "End") {
          event.preventDefault();
          selectIndex(values.length - 1);
        }
      }}
      onScroll={() => {
        const list = listRef.current;

        if (list) {
          setScrollIndex(list.scrollTop / ITEM_HEIGHT);
        }

        if (scrollTimerRef.current !== null) {
          window.clearTimeout(scrollTimerRef.current);
        }

        scrollTimerRef.current = window.setTimeout(
          settleSelection,
          SETTLE_DELAY_MS,
        );
      }}
      className="h-[224px] select-none snap-y snap-mandatory overflow-y-auto overscroll-contain py-24 [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)] [perspective:260px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {values.map((value, index) => {
        const selected = value === selectedValue;
        const distance = index - scrollIndex;
        const rotation = getRotation(distance);
        const textHeight = interpolateByDistance(
          TEXT_HEIGHT_BY_DISTANCE,
          distance,
        );
        const cellHeight = interpolateByDistance(
          CELL_HEIGHT_BY_DISTANCE,
          distance,
        );
        const centerOffset = interpolateByDistance(
          CENTER_OFFSET_BY_DISTANCE,
          distance,
        );
        const translateY = -Math.sign(distance) * centerOffset;

        return (
          <div
            id={`${optionIdPrefix}-${value}`}
            key={value}
            role="option"
            aria-selected={selected}
            onClick={() => onSelect(value)}
            style={{
              transform: `translateY(${translateY}px) rotateX(${rotation}deg)`,
            }}
            className="flex h-8 w-full cursor-pointer snap-center items-center justify-center [backface-visibility:hidden] [transform-style:preserve-3d]"
          >
            <span
              style={{
                height: `${cellHeight}px`,
                transform: `scaleY(${textHeight / 30})`,
              }}
              className={`flex w-full items-center justify-center text-center font-sans text-[20px] font-medium leading-[150%] tracking-[-0.3px] ${
                selected ? "text-black-200" : "text-black-750"
              }`}
            >
              {formatValue(value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function getAvailableMonths(year: number, minMonth: Date, maxMonth: Date) {
  return Array.from({ length: 12 }, (_, index) => index).filter(
    (monthIndex) => {
      const candidate = new Date(year, monthIndex, 1);
      return candidate >= minMonth && candidate <= maxMonth;
    },
  );
}

export function MonthYearPicker({
  year,
  month,
  minMonth,
  maxMonth,
  onChange,
}: MonthYearPickerProps) {
  const minYear = minMonth.getFullYear();
  const maxYear = maxMonth.getFullYear();
  const years = useMemo(
    () =>
      Array.from(
        { length: maxYear - minYear + 1 },
        (_, index) => minYear + index,
      ),
    [maxYear, minYear],
  );
  const availableMonths = useMemo(
    () => getAvailableMonths(year, minMonth, maxMonth),
    [maxMonth, minMonth, year],
  );

  function selectYear(nextYear: number) {
    const validMonths = getAvailableMonths(nextYear, minMonth, maxMonth);
    const nextMonth = validMonths.includes(month)
      ? month
      : (validMonths[0] ?? month);

    onChange(nextYear, nextMonth);
  }

  return (
    <div
      role="group"
      aria-label="연도와 월 선택"
      className="relative grid h-[224px] grid-cols-2 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2 top-24 z-0 h-8 rounded-[8px] bg-black-800"
      />
      <div className="relative z-10">
        <WheelColumn
          ariaLabel="연도"
          values={years}
          selectedValue={year}
          formatValue={(value) => `${value}`}
          onSelect={selectYear}
        />
      </div>
      <div className="relative z-10">
        <WheelColumn
          ariaLabel="월"
          values={availableMonths}
          selectedValue={month}
          formatValue={(value) => `${value + 1}월`}
          onSelect={(nextMonth) => onChange(year, nextMonth)}
        />
      </div>
    </div>
  );
}
