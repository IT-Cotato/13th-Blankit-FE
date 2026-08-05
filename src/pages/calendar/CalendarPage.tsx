import { useMemo, useState } from "react";

import { mockTasks } from "@/mocks/tasks";

import {
    CalendarGrid,
    type CalendarDayCell,
} from "@/components/calendar/CalendarGrid";
import { CalendarTopBar } from "@/components/calendar/CalendarTopBar";
import { CalendarTaskSheet } from "./CalendarTaskSheet";

const MONTH_LABELS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const getDaysInMonth = (date: Date): CalendarDayCell[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const leadingBlankCount = firstDay.getDay();
    const totalCells = Math.ceil((leadingBlankCount + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
        const dayOffset = index - leadingBlankCount + 1;
        const cellDate = new Date(year, month, dayOffset);
        const yyyy = String(cellDate.getFullYear());
        const mm = String(cellDate.getMonth() + 1).padStart(2, "0");
        const dd = String(cellDate.getDate()).padStart(2, "0");
        const dateKey = `${yyyy}-${mm}-${dd}`;
        const tasksForDay = mockTasks.filter(
            (task) => task.deadline === dateKey,
        );

        return {
            key: dateKey,
            day: cellDate.getDate(),
            isCurrentMonth: cellDate.getMonth() === month,
            isToday: cellDate.toDateString() === new Date().toDateString(),
            tasks: tasksForDay,
        };
    });
};

export const CalendarPage = () => {
    const today = new Date();
    const yyyy = String(today.getFullYear());
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const defaultDateKey = `${yyyy}-${mm}-${dd}`;

    const [selectedDate, setSelectedDate] = useState<string | null>(
        defaultDateKey,
    );
    const monthDays = useMemo(() => getDaysInMonth(new Date()), []);

    const selectedTasks = useMemo(() => {
        if (!selectedDate) {
            return [];
        }

        return mockTasks.filter((task) => task.deadline === selectedDate);
    }, [selectedDate]);

    const handleSelectDate = (dateKey: string) => {
        setSelectedDate(dateKey);
    };

    return (
        <div className="h-dvh bg-black-900 text-black-100">
            <CalendarTopBar
                monthLabel={MONTH_LABELS[today.getMonth()]}
                year={today.getFullYear()}
            />
            <div className="px-5 pt-5">
                <CalendarGrid
                    monthDays={monthDays}
                    onSelectDate={handleSelectDate}
                />
            </div>

            <CalendarTaskSheet
                selectedDate={selectedDate}
                tasks={selectedTasks}
                onClose={() => setSelectedDate(null)}
            />
        </div>
    );
};
