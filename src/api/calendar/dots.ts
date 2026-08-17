import { apiClient } from "@/api/client";
import type { CalendarMonthlyTasksByDate } from "@/types/calendarMonthlyTasks";

interface ApiResponse<T> {
    code: string;
    message: string;
    data: T;
}

// 스웨거 스펙 기준 경로 — stats 쪽 엔드포인트들과 달리 /v1 접두사가 없음 (백엔드 확인 필요할 수 있음)
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
