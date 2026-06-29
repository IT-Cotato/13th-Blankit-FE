// src/store/useAppStore.ts
import { create } from 'zustand';

// 1. 상태(State)와 액션(Action)의 타입 정의
interface AppState {
  currentFeature: string;
  setFeature: (feature: string) => void;
}

// 2. 스토어 생성
export const useAppStore = create<AppState>((set) => ({
  currentFeature: 'home', // 초기값
  setFeature: (feature) => set({ currentFeature: feature }), // 상태 변경 함수
}));