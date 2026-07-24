const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getCurrentWeek() {
  const today = new Date();
  const sunday = new Date(today);

  sunday.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);

    return {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      day: date.getDate(),
      weekday: WEEKDAYS[date.getDay()],
      isToday: date.toDateString() === today.toDateString(),
    };
  });
}

export function WeeklyCalendar() {
  const weekDates = getCurrentWeek();

  return (
    <section
      aria-label="이번 주 달력"
      className="h-[89px] w-full rounded-[12px] bg-black-850 px-2 py-3"
    >
      <ul className="grid grid-cols-7">
        {weekDates.map((date) => (
          <li
            key={date.key}
            className="flex flex-col items-center p-2 gap-1"
          >
            <span
                className={`text-[16px] font-semibold ${
                    date.isToday
                    ? "text-green-500"
                    : "text-black-100"
                }`}
                >
                {date.day}
            </span>

            <span
              className={`text-[14px] font-medium ${
                date.isToday
                  ? "text-green-700"
                  : "text-black-700"
              }`}
            >
              {date.weekday}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}