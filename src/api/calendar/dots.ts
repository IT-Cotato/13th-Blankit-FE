import { apiClient } from "@/api/client";
import type { CalendarMonthlyTasksByDate } from "@/types/calendarMonthlyTasks";

interface ApiResponse<T> {
    code: string;
    message: string;
    data: T;
}

const MONTHLY_CALENDAR_TASKS_ENDPOINT_PATH = "/api/tasks/calendar";

export const fetchMonthlyCalendarTasks = async (
    year: number,
    month: number,
): Promise<CalendarMonthlyTasksByDate[]> => {
    const { data } = await apiClient.get<
        ApiResponse<CalendarMonthlyTasksByDate[]>
    >(MONTHLY_CALENDAR_TASKS_ENDPOINT_PATH, { params: { year, month } });

    return data.data;
};
