import type { CategoryIconKey } from "./category";

export interface DailyStat {
    date: string; // YYYY-MM-DD
    // 과거·오늘: 실제 값 / 미래: null (API 명세 그대로)
    actualMinutes: number | null;
    recommendedMinutes: number;
}

export interface MonthlyCalendarStatsData {
    year: number;
    month: number;
    dailyStats: DailyStat[];
}

export interface FeedbackTask {
    taskId: number;
    title: string;
    categoryName: string;
    categoryColor: string;
    categoryIconKey: CategoryIconKey;
    progressRate: number;
    isCompleted: boolean;
    memo: string | null;
}

export interface DailyFeedbackData {
    date: string;
    totalElapsedSeconds: number;
    totalRecommendedMinutes: number;
    feedbackTasks: FeedbackTask[];
}
