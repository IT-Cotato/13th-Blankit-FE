import { apiClient } from "@/api/client";
import type {
    DailyFeedbackData,
    MonthlyCalendarStatsData,
} from "@/types/calendarStats";

interface ApiResponse<T> {
    code: string;
    message: string;
    data: T;
}

const MONTHLY_STATS_ENDPOINT_PATH = "/api/v1/tasks/stats/monthly";
const DAILY_STATS_ENDPOINT_PATH = "/api/v1/tasks/stats/daily";

export const fetchMonthlyCalendarStats = async (
    year: number,
    month: number,
): Promise<MonthlyCalendarStatsData> => {
    const { data } = await apiClient.get<ApiResponse<MonthlyCalendarStatsData>>(
        MONTHLY_STATS_ENDPOINT_PATH,
        { params: { year, month } },
    );
    return data.data;
};

export const fetchDailyFeedback = async (
    date: string, // YYYY-MM-DD
): Promise<DailyFeedbackData> => {
    const { data } = await apiClient.get<ApiResponse<DailyFeedbackData>>(
        DAILY_STATS_ENDPOINT_PATH,
        { params: { date } },
    );
    return data.data;
};
