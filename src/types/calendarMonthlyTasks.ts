import type { TaskStatus } from "@/types/task";

export interface CalendarTaskDot {
    taskId: number;
    title: string;
    categoryColor: string;
    categoryIconKey: string;
    status: TaskStatus;
}

export interface CalendarMonthlyTasksByDate {
    date: string;
    tasks: CalendarTaskDot[];
}
