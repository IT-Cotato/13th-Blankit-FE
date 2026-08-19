import { useNavigate } from "react-router-dom";

import { fetchSocialLogin, fetchSocialSignup } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { getInstallationId } from "@/lib/installationId";
import {
    isAnotherDeviceLoggedInError,
    isRefreshTokenConflictError,
    isUserNotFoundError,
} from "@/lib/isUserNotFoundError";
import { markInitialNotificationPermission } from "@/components/notification/notificationPermissionStorage";
import type { SocialAuthResult, SocialProvider } from "@/types/auth";

export const useSocialAuth = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const processSocialAuthResult = async (
        provider: SocialProvider,
        socialAuthResult: SocialAuthResult,
    ) => {
        const installationId = getInstallationId();

        try {
            const loginData = await fetchSocialLogin({
                socialProvider: provider,
                socialId: socialAuthResult.socialId,
                socialToken: socialAuthResult.socialToken,
                installationId,
            });

            setAuth(loginData);

            navigate("/");
            return;
        } catch (error) {
            // 다른 기기에서 이미 로그인 중이거나(409) Refresh Token 처리 충돌(409)인 경우
            // 회원가입 대상이 아니므로 그대로 호출부(LoginPage)로 재던져 에러 메시지 처리에 맡김
            if (
                isAnotherDeviceLoggedInError(error) ||
                isRefreshTokenConflictError(error)
            ) {
                throw error;
            }

            if (!isUserNotFoundError(error)) {
                throw error;
            }
        }

        const signupData = await fetchSocialSignup({
            socialProvider: provider,
            socialId: socialAuthResult.socialId,
            socialToken: socialAuthResult.socialToken,
            email: socialAuthResult.email,
            nickname: socialAuthResult.nickname,
            profileImageUrl: socialAuthResult.profileImageUrl,
            recommendedDailyTime: null,
            installationId,
        });

        setAuth(signupData);

        // 회원가입 직후 최초 홈 진입에서만
        // 알림 권한 안내 모달을 표시하기 위한 플래그
        markInitialNotificationPermission(
            signupData.user.userId,
        );

        navigate("/");
    };

    return { processSocialAuthResult };
};
