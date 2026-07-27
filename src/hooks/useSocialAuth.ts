import { useNavigate } from "react-router-dom";

import { fetchSocialLogin, fetchSocialSignup } from "@/api/socialAuth/auth";
import { useAuthStore } from "@/store/authStore";
import { isUserNotFoundError } from "@/lib/isUserNotFoundError";
import type { SocialAuthResult, SocialProvider } from "@/types/auth";

export const useSocialAuth = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const processSocialAuthResult = async (
        provider: SocialProvider,
        socialAuthResult: SocialAuthResult,
    ) => {
        try {
            const loginData = await fetchSocialLogin({
                socialProvider: provider,
                socialId: socialAuthResult.socialId,
                socialToken: socialAuthResult.socialToken,
            });

            setAuth(loginData);
            navigate("/");
            return;
        } catch (error) {
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
            recommendedDailyTime: null, // TODO: 백엔드에서 DB 명세 수정 후 수정사항 반영 예정
        });

        setAuth(signupData);
        navigate("/");
    };

    return { processSocialAuthResult };
};
