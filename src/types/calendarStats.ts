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
    categoryIconKey: string;
    progressRate: number;
    isCompleted: boolean;
}

export interface DailyFeedbackData {
    date: string;
    totalElapsedSeconds: number;
    totalRecommendedMinutes: number;
    // "피드백을 완료한 과업만" — 서버가 이미 필터링해서 준다는 전제로,
    // 클라이언트에서 별도 필터링은 하지 않습니다.
    feedbackTasks: FeedbackTask[];
}
