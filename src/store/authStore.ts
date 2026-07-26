import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, NormalizedAuthData } from "@/types/auth";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    setAuth: (data: NormalizedAuthData) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            setAuth: ({ accessToken, refreshToken, user }) => {
                set({
                    accessToken,
                    refreshToken,
                    user,
                    isAuthenticated: true,
                });
            },
            clearAuth: () => {
                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null,
                    isAuthenticated: false,
                });
            },
        }),
        { name: "auth-storage" },
    ),
);
