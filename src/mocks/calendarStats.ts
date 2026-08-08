import type { DailyStat } from "@/types/calendarStats";

// 다양한 케이스를 섞은 목데이터:
// - 6일, 12일, 20일: 부분 채움 (25칸 중 일부)
// - 19일, 25일, 26일: 권장 시간 달성/초과 (꽉 찬 셀 - 사진 2번 케이스)
// - 나머지 평일: 랜덤한 부분 채움
// - 없는 날짜(주말 등): dailyStats에 없음 -> actualMinutes 0 처리
export const mockDailyStats: DailyStat[] = [
    { date: "2026-08-01", actualMinutes: 30, recommendedMinutes: 120 },
    { date: "2026-08-03", actualMinutes: 60, recommendedMinutes: 120 },
    { date: "2026-08-04", actualMinutes: 90, recommendedMinutes: 120 },
    { date: "2026-08-05", actualMinutes: 45, recommendedMinutes: 90 },
    { date: "2026-08-06", actualMinutes: 100, recommendedMinutes: 100 }, // 정확히 100% - 꽉 참
    { date: "2026-08-07", actualMinutes: 20, recommendedMinutes: 120 },
    { date: "2026-08-08", actualMinutes: 75, recommendedMinutes: 150 }, // 오늘
    { date: "2026-08-10", actualMinutes: 130, recommendedMinutes: 120 }, // 초과 달성 - 꽉 참
    { date: "2026-08-11", actualMinutes: 40, recommendedMinutes: 100 },
    { date: "2026-08-12", actualMinutes: 55, recommendedMinutes: 110 },
    { date: "2026-08-13", actualMinutes: 10, recommendedMinutes: 90 },
    { date: "2026-08-14", actualMinutes: 0, recommendedMinutes: 120 },
    { date: "2026-08-17", actualMinutes: 80, recommendedMinutes: 100 },
    { date: "2026-08-18", actualMinutes: 65, recommendedMinutes: 130 },
    { date: "2026-08-19", actualMinutes: 150, recommendedMinutes: 150 }, // 딱 달성 - 꽉 참
    { date: "2026-08-20", actualMinutes: 35, recommendedMinutes: 140 },
    { date: "2026-08-21", actualMinutes: 25, recommendedMinutes: 100 },
    { date: "2026-08-24", actualMinutes: 90, recommendedMinutes: 90 }, // 딱 달성 - 꽉 참
    { date: "2026-08-25", actualMinutes: 160, recommendedMinutes: 120 }, // 초과 달성 - 꽉 참
    { date: "2026-08-26", actualMinutes: 200, recommendedMinutes: 150 }, // 초과 달성 - 꽉 참
    { date: "2026-08-27", actualMinutes: 5, recommendedMinutes: 100 },
    { date: "2026-08-28", actualMinutes: 50, recommendedMinutes: 100 },
];

export const mockMonthlyCalendarStats = {
    year: 2026,
    month: 8,
    dailyStats: mockDailyStats,
};

// date(YYYY-MM-DD) -> DailyStat 조회를 O(1)로 하기 위한 맵.
export const mockDailyStatsByDate: Record<string, DailyStat> =
    Object.fromEntries(mockDailyStats.map((stat) => [stat.date, stat]));
