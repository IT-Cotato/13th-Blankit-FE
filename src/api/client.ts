import axios from "axios";

import { useAuthStore } from "@/store/authStore";

const REISSUE_ENDPOINT_PATH = "/api/auth/reissue";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 요청 보낼 때마다 accessToken이 있으면 자동으로 Authorization 헤더에 첨부
apiClient.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

// accessToken 만료(401) 시 refreshToken으로 자동 재발급 후 원래 요청 재시도
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isReissueRequest = originalRequest?.url?.includes(
            REISSUE_ENDPOINT_PATH,
        );
        const isAlreadyRetried = originalRequest?._isRetried;

        if (
            error.response?.status !== 401 ||
            isReissueRequest ||
            isAlreadyRetried
        ) {
            return Promise.reject(error);
        }

        const { refreshToken, updateTokens, clearAuth } =
            useAuthStore.getState();

        if (!refreshToken) {
            clearAuth();
            window.location.href = "/login";
            return Promise.reject(error);
        }

        try {
            originalRequest._isRetried = true;

            // 순환 참조(client.ts ↔ apis/auth.ts)를 피하기 위해
            // apiClient가 아닌 별도 axios 인스턴스로 직접 요청
            const reissueResponse = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}${REISSUE_ENDPOINT_PATH}`,
                { refreshToken },
            );
            const {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            } = reissueResponse.data.data;

            updateTokens(newAccessToken, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        } catch (reissueError) {
            clearAuth();
            window.location.href = "/login";
            return Promise.reject(reissueError);
        }
    },
);
