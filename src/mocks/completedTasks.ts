import type { CompletedTaskItem } from "@/types/completedTask";

export const mockCompletedTasks: CompletedTaskItem[] = [
  {
    taskId: 1,
    title: "알고리즘 실습문제 5개 풀기",
    categoryId: 1,
    categoryName: "학교",
    categoryColor: "#FFB85C",
    deadline: "2026-07-10",
    totalElapsedTime: 11900,
  },
  {
    taskId: 2,
    title: "테크블로그 1개 포스팅",
    categoryId: 2,
    categoryName: "개인",
    categoryColor: "#84EB99",
    deadline: "2026-07-19",
    totalElapsedTime: 4177,
  },
  {
    taskId: 3,
    title: "RN API 연동 실습",
    categoryId: 3,
    categoryName: "개발",
    categoryColor: "#B3BBFA",
    deadline: "2026-07-23",
    totalElapsedTime: 9106,
  },
  {
    taskId: 4,
    title: "Swift UI 노치 적용 실습",
    categoryId: 3,
    categoryName: "개발",
    categoryColor: "#B3BBFA",
    deadline: "2026-06-30",
    totalElapsedTime: 7518,
  },
];
