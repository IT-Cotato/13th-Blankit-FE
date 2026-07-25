import balanceModeIcon from "@/assets/icons/task-combination/balance-mode.svg";
import fireModeIcon from "@/assets/icons/task-combination/fire-mode.svg";
import getItDoneModeIcon from "@/assets/icons/task-combination/get-it-done-mode.svg";
import quickTryModeIcon from "@/assets/icons/task-combination/quick-try-mode.svg";
import archiveCategoryIcon from "@/assets/icons/task-category/archive.svg";
import briefcaseCategoryIcon from "@/assets/icons/task-category/briefcase.svg";
import pencilCategoryIcon from "@/assets/icons/task-category/pencil.svg";

import type { TaskCombination } from "@/types/taskCombination";

export const taskCombinations = [
  {
    id: "fire",
    name: "불 끄기 모드",
    description: "급한 과업부터 빠르게 처리해요.",
    icon: fireModeIcon,
    accent: "red",
    tasks: [
      {
        id: "fire-1",
        title: "발표 자료 최종 수정",
        lastMemo: "피드백 반영하기",
        priority: "HIGH",
        status: "IN_PROGRESS",
        progressRate: 20,
        estimatedMinutes: 30,
        categoryId: "work",
        categoryName: "업무",
        categoryIcon: briefcaseCategoryIcon,
      },
      {
        id: "fire-2",
        title: "오늘 마감 보고서 제출",
        lastMemo: "첨부 파일 확인하기",
        priority: "HIGH",
        status: "TODO",
        progressRate: 0,
        estimatedMinutes: 40,
        categoryId: "submit",
        categoryName: "제출",
        categoryIcon: archiveCategoryIcon,
      },
    ],
  },
  {
    id: "balance",
    name: "밸런스 모드",
    description: "중요도와 소요 시간을 고르게 배치해요.",
    icon: balanceModeIcon,
    accent: "green",
    tasks: [
      {
        id: "balance-1",
        title: "물리 공부",
        lastMemo: "역학 문제 복습",
        priority: "HIGH",
        status: "IN_PROGRESS",
        progressRate: 20,
        estimatedMinutes: 50,
        categoryId: "study",
        categoryName: "공부",
        categoryIcon: pencilCategoryIcon,
      },
      {
        id: "balance-2",
        title: "책상 정리",
        lastMemo: null,
        priority: "LOW",
        status: "TODO",
        progressRate: 0,
        estimatedMinutes: 15,
        categoryId: "organize",
        categoryName: "정리",
        categoryIcon: archiveCategoryIcon,
      },
    ],
  },
  {
    id: "quick-try",
    name: "빠른 시도 모드",
    description: "짧게 끝낼 수 있는 과업부터 시작해요.",
    icon: quickTryModeIcon,
    accent: "purple",
    tasks: [
      {
        id: "quick-try-1",
        title: "이메일 답장",
        lastMemo: "확인 요청 회신",
        priority: "MEDIUM",
        status: "TODO",
        progressRate: 0,
        estimatedMinutes: 10,
        categoryId: "work",
        categoryName: "업무",
        categoryIcon: briefcaseCategoryIcon,
      },
      {
        id: "quick-try-2",
        title: "주간 일정 확인",
        lastMemo: null,
        priority: "LOW",
        status: "TODO",
        progressRate: 0,
        estimatedMinutes: 10,
        categoryId: "organize",
        categoryName: "정리",
        categoryIcon: archiveCategoryIcon,
      },
    ],
  },
  {
    id: "get-it-done",
    name: "끝장내기 모드",
    description: "집중해서 큰 과업을 마무리해요.",
    icon: getItDoneModeIcon,
    accent: "orange",
    tasks: [
      {
        id: "get-it-done-1",
        title: "프로젝트 발표 준비",
        lastMemo: "발표 흐름 정리",
        priority: "HIGH",
        status: "IN_PROGRESS",
        progressRate: 60,
        estimatedMinutes: 90,
        categoryId: "work",
        categoryName: "업무",
        categoryIcon: briefcaseCategoryIcon,
      },
      {
        id: "get-it-done-2",
        title: "포트폴리오 수정",
        lastMemo: "프로젝트 설명 보완",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        progressRate: 40,
        estimatedMinutes: 80,
        categoryId: "create",
        categoryName: "창작",
        categoryIcon: pencilCategoryIcon,
      },
    ],
  },
] satisfies TaskCombination[];

export function getTaskCombination(modeId: string) {
  return taskCombinations.find((mode) => mode.id === modeId);
}
