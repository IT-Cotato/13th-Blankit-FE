import { useNavigate } from "react-router-dom";

import { fetchSocialLogin, fetchSocialSignup } from "@/api/auth";
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

            // ========== TEST CODE START ==========
            // 로그인 성공 시 사용자명 / 소셜 provider / 이메일을 알림창으로 확인
            alert(
                `[로그인 성공]\n닉네임: ${loginData.user.nickname}\n소셜: ${loginData.user.socialProvider}\n이메일: ${loginData.user.email}`,
            );
            // ========== TEST CODE END ==========

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

        // ========== TEST CODE START ==========
        // 회원가입(최초 로그인) 성공 시 사용자명 / 소셜 provider / 이메일을 알림창으로 확인
        alert(
            `[회원가입 성공]\n닉네임: ${signupData.user.nickname}\n소셜: ${signupData.user.socialProvider}\n이메일: ${signupData.user.email}`,
        );
        // ========== TEST CODE END ==========

        navigate("/");
    };

    return { processSocialAuthResult };
};
