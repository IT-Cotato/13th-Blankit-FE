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
      className="h-[128px] snap-y snap-mandatory overflow-y-auto overscroll-contain py-12 [mask-image:linear-gradient(to_bottom,transparent_0%,black_28%,black_72%,transparent_100%)] [perspective:180px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {values.map((value, index) => {
        const selected = value === selectedValue;
        const distance = index - scrollIndex;
        const absoluteDistance = Math.min(Math.abs(distance), 3);
        const rotation = Math.max(-68, Math.min(68, distance * -26));
        const scale = Math.max(0.72, 1 - absoluteDistance * 0.1);
        const opacity = Math.max(0.18, 1 - absoluteDistance * 0.28);

        return (
          <div
            id={`${optionIdPrefix}-${value}`}
            key={value}
            role="option"
            aria-selected={selected}
            onClick={() => onSelect(value)}
            style={{
              opacity,
              transform: `rotateX(${rotation}deg) scale(${scale})`,
            }}
            className={`flex h-8 w-full cursor-pointer snap-center items-center justify-center text-[16px] [backface-visibility:hidden] [transform-style:preserve-3d] ${
              selected
                ? "text-[20px] font-semibold text-black-100"
                : "font-medium text-black-700"
            }`}
          >
            {formatValue(value)}
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
      className="relative grid h-[128px] grid-cols-2 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2 top-12 z-0 h-8 rounded-[6px] bg-black-800"
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
