import type {
  DeleteSearchHistoryResponse,
  SearchHistoryResponse,
  SearchTaskResponse,
} from "@/types/search";

export const mockSearchSuccess: SearchTaskResponse = {
  code: "SEARCH200",
  message: "검색에 성공했습니다.",
  data: {
    totalCount: 5,
    tasks: [
      {
        taskId: 1,
        title: "수학 기말고사 준비",
        categoryId: 1,
        categoryName: "학업",
        categoryColor: "#FF5C5C",
        priority: "HIGH",
        deadline: "2026-07-20",
        status: "IN_PROGRESS",
        progressRate: 40,
      },
      {
        taskId: 2,
        title: "수학 문제집 3단원 풀기",
        categoryId: 1,
        categoryName: "학업",
        categoryColor: "#FF5C5C",
        priority: "MEDIUM",
        deadline: "2026-07-21",
        status: "TODO",
        progressRate: 0,
      },
      {
        taskId: 3,
        title: "수학 과외 숙제",
        categoryId: 1,
        categoryName: "학업",
        categoryColor: "#FF5C5C",
        priority: "HIGH",
        deadline: "2026-07-22",
        status: "IN_PROGRESS",
        progressRate: 60,
      },
      {
        taskId: 4,
        title: "수학 스터디 준비",
        categoryId: 2,
        categoryName: "스터디",
        categoryColor: "#B3BBFA",
        priority: "LOW",
        deadline: "2026-07-23",
        status: "TODO",
        progressRate: 0,
      },
      {
        taskId: 5,
        title: "수학 오답노트 정리",
        categoryId: 1,
        categoryName: "학업",
        categoryColor: "#FF5C5C",
        priority: "MEDIUM",
        deadline: "2026-07-24",
        status: "IN_PROGRESS",
        progressRate: 20,
      },
    ],
  },
};

export const mockSearchEmpty: SearchTaskResponse = {
  code: "SEARCH200",
  message: "검색에 성공했습니다.",
  data: {
    totalCount: 0,
    tasks: [],
  },
};

export const mockSearchHistorySuccess: SearchHistoryResponse = {
  code: "SEARCH_HISTORY200",
  message: "최근 검색어 조회에 성공했습니다.",
  data: [
    {
      searchHistoryId: 10,
      keyword: "기말고사",
      searchedAt: "2026-07-17T18:30:00",
    },
    {
      searchHistoryId: 9,
      keyword: "알고리즘",
      searchedAt: "2026-07-17T17:10:00",
    },
    {
      searchHistoryId: 8,
      keyword: "물리 공부",
      searchedAt: "2026-07-16T20:15:00",
    },
    {
      searchHistoryId: 7,
      keyword: "수학 과제",
      searchedAt: "2026-07-16T14:20:00",
    },
    {
      searchHistoryId: 6,
      keyword: "영어 단어",
      searchedAt: "2026-07-15T21:00:00",
    },
  ],
};

export const mockSearchHistoryEmpty: SearchHistoryResponse = {
  code: "SEARCH_HISTORY200",
  message: "최근 검색어 조회에 성공했습니다.",
  data: [],
};

export const mockDeleteSearchHistorySuccess: DeleteSearchHistoryResponse = {
  code: "SEARCH_HISTORY_DELETE200",
  message: "최근 검색어를 삭제했습니다.",
  data: "삭제 성공",
};

export const mockClearSearchHistorySuccess: DeleteSearchHistoryResponse = {
  code: "SEARCH_HISTORY_CLEAR200",
  message: "최근 검색어를 모두 삭제했습니다.",
  data: "전체 삭제 성공",
};