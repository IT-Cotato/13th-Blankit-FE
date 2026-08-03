export type CalendarCell =
  | {
      kind: "date";
      key: string;
      day: number;
      date: Date;
    }
  | {
      kind: "empty";
      key: string;
      day: null;
      date: null;
    };

export function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function isSameDate(left: Date | null, right: Date | null) {
  if (!left || !right) {
    return false;
  }

  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function getCalendarCells(month: Date): CalendarCell[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + lastDay) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - firstWeekday + 1;

    if (day < 1 || day > lastDay) {
      return {
        kind: "empty",
        key: `${year}-${monthIndex + 1}-empty-${index}`,
        day: null,
        date: null,
      };
    }

    return {
      kind: "date",
      key: `${year}-${monthIndex + 1}-${day}`,
      day,
      date: new Date(year, monthIndex, day),
    };
  });
}

export function formatMonth(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function formatDeadline(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatFullDate(date: Date | null, emptyLabel: string) {
  if (!date) {
    return emptyLabel;
  }

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}
