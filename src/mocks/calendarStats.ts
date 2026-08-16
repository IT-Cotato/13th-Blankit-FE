import type { DailyStat, DailyFeedbackData } from "@/types/calendarStats";

// ============================================================
// GET /api/v1/tasks/stats/monthly 대응 mock
// 캘린더 셀 색상 렌더링에 사용됩니다. (data.dailyStats)
// ============================================================

// mockDailyFeedbacks가 존재하는 날짜(08-06, 08-08, 08-19, 08-25)만
// actualMinutes를 채우고, 나머지 날짜는 상세 피드백이 없는 상태를 반영해
// actualMinutes: 0으로 둡니다. (recommendedMinutes는 그대로 유지)
export const mockDailyStats: DailyStat[] = [
    { date: "2026-08-06", actualMinutes: 100, recommendedMinutes: 100 }, // 정확히 100% - 꽉 참 (feedback 있음)
    { date: "2026-08-08", actualMinutes: 75, recommendedMinutes: 150 }, // feedback 있음
    { date: "2026-08-10", actualMinutes: 150, recommendedMinutes: 150 }, // 딱 달성 - 꽉 참 (feedback 있음)
    { date: "2026-08-12", actualMinutes: 160, recommendedMinutes: 120 }, // 초과 달성 - 꽉 참 (feedback 있음)
];

export const mockMonthlyCalendarStats = {
    year: 2026,
    month: 8,
    dailyStats: mockDailyStats,
};

// date(YYYY-MM-DD) -> DailyStat 조회를 O(1)로 하기 위한 맵.
export const mockDailyStatsByDate: Record<string, DailyStat> =
    Object.fromEntries(mockDailyStats.map((stat) => [stat.date, stat]));

// ============================================================
// GET /api/v1/tasks/stats/daily 대응 mock
// 바텀시트 통계(피드백) 화면에 사용됩니다. (data)
// mockDailyStats와는 별개의 API 응답이라 독립적으로 정의합니다.
// 아래 날짜들의 totalElapsedSeconds(초) / 60 = mockDailyStats의 actualMinutes와
// 항상 동일하도록 맞춰둡니다.
// ============================================================
export const mockDailyFeedbacks: DailyFeedbackData[] = [
    // 2026-08-06 ↔ mockDailyStats: actualMinutes 100 / recommendedMinutes 100
    {
        date: "2026-08-06",
        totalElapsedSeconds: 6000, // 100분
        totalRecommendedMinutes: 100,
        feedbackTasks: [
            {
                taskId: 201,
                title: "13th-Blankit-FE 캘린더 UI 작업",
                categoryName: "개발",
                categoryColor: "#5C8DFF",
                categoryIconKey: "work",
                progressRate: 100,
                isCompleted: true,
            },
            {
                taskId: 202,
                title: "백준 알고리즘 3문제",
                categoryName: "알고리즘",
                categoryColor: "#FFC15C",
                categoryIconKey: "study",
                progressRate: 60,
                isCompleted: false,
            },
        ],
    },
    // 2026-08-08 ↔ mockDailyStats: actualMinutes 75 / recommendedMinutes 150
    {
        date: "2026-08-08",
        totalElapsedSeconds: 4500, // 75분
        totalRecommendedMinutes: 150,
        feedbackTasks: [
            {
                taskId: 203,
                title: "TUMS 정기 회의 준비",
                categoryName: "동아리",
                categoryColor: "#5CFFB0",
                categoryIconKey: "hobby",
                progressRate: 100,
                isCompleted: true,
            },
            {
                taskId: 204,
                title: "OAuth 소셜 로그인 디버깅",
                categoryName: "개발",
                categoryColor: "#5C8DFF",
                categoryIconKey: "work",
                progressRate: 40,
                isCompleted: false,
            },
            {
                taskId: 205,
                title: "유령의 마음으로 30쪽 읽기",
                categoryName: "독서",
                categoryColor: "#B85CFF",
                categoryIconKey: "note",
                progressRate: 20,
                isCompleted: false,
            },
        ],
    },
    // 2026-08-19 ↔ mockDailyStats: actualMinutes 150 / recommendedMinutes 150
    {
        date: "2026-08-10",
        totalElapsedSeconds: 9000, // 150분
        totalRecommendedMinutes: 150,
        feedbackTasks: [
            {
                taskId: 206,
                title: "Vercel 환경변수 설정 정리",
                categoryName: "개발",
                categoryColor: "#5C8DFF",
                categoryIconKey: "work",
                progressRate: 100,
                isCompleted: true,
            },
            {
                taskId: 207,
                title: "F-Grade-Project 팝업 UI 리팩터링",
                categoryName: "게임개발",
                categoryColor: "#FF8A5C",
                categoryIconKey: "work",
                progressRate: 100,
                isCompleted: true,
            },
        ],
    },
    // 2026-08-25 ↔ mockDailyStats: actualMinutes 160 / recommendedMinutes 120
    {
        date: "2026-08-12",
        totalElapsedSeconds: 9600, // 160분
        totalRecommendedMinutes: 120,
        feedbackTasks: [
            {
                taskId: 208,
                title: "ML 경진대회 2단계 파이프라인 정리",
                categoryName: "프로젝트",
                categoryColor: "#B85CFF",
                categoryIconKey: "goal",
                progressRate: 100,
                isCompleted: true,
            },
            {
                taskId: 209,
                title: "REST API 발표 자료 검토",
                categoryName: "발표",
                categoryColor: "#5CFFB0",
                categoryIconKey: "checklist",
                progressRate: 100,
                isCompleted: true,
            },
            {
                taskId: 210,
                title: "슬기로운 게임 생활 대회 운영 정리",
                categoryName: "동아리",
                categoryColor: "#FFC15C",
                categoryIconKey: "hobby",
                progressRate: 80,
                isCompleted: false,
            },
        ],
    },
];
// date(YYYY-MM-DD) -> DailyFeedbackData 조회를 O(1)로 하기 위한 맵.
export const mockDailyFeedbackByDate: Record<string, DailyFeedbackData> =
    Object.fromEntries(
        mockDailyFeedbacks.map((feedback) => [feedback.date, feedback]),
    );
