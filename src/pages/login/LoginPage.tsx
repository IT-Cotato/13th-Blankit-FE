import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";

import googleIcon from "@/assets/icons/social/google-icon.svg";
import kakaoIcon from "@/assets/icons/social/kakaotalk-icon.svg";
import logoImage from "@/assets/logo/blankit-logo.svg";

import { SocialLoginButton } from "@/components/login/SocialLoginButton";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { useAuthStore } from "@/store/authStore";
import { isValidOauthState } from "@/lib/oauthState";
import {
    buildGoogleAuthUrl,
    fetchGoogleSocialAuthResult,
    parseGoogleIdTokenFromHash,
    parseGoogleStateFromHash,
} from "@/api/socialAuth/google";
import {
    buildKakaoAuthUrl,
    fetchKakaoSocialAuthResult,
} from "@/api/socialAuth/kakao";

export const LoginPage = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { processSocialAuthResult } = useSocialAuth();
    const hasRunCallbackRef = useRef(false);

    useEffect(() => {
        if (hasRunCallbackRef.current) return;

        const searchParameters = new URLSearchParams(window.location.search);
        const kakaoCode = searchParameters.get("code");
        const googleIdToken = parseGoogleIdTokenFromHash(window.location.hash);

        if (!kakaoCode && !googleIdToken) return;

        hasRunCallbackRef.current = true;

        const state = googleIdToken
            ? parseGoogleStateFromHash(window.location.hash)
            : searchParameters.get("state");

        const handleCallback = async () => {
            if (!isValidOauthState(state)) {
                alert("잘못된 인증 요청입니다.");
                window.history.replaceState(null, "", "/login");
                return;
            }

            try {
                if (googleIdToken) {
                    const socialAuthResult =
                        await fetchGoogleSocialAuthResult(googleIdToken);
                    await processSocialAuthResult("GOOGLE", socialAuthResult);
                    return;
                }

                if (kakaoCode) {
                    const socialAuthResult =
                        await fetchKakaoSocialAuthResult(kakaoCode);
                    await processSocialAuthResult("KAKAO", socialAuthResult);
                }
            } catch {
                alert("로그인에 실패했습니다.");
                window.history.replaceState(null, "", "/login");
            }
        };

        handleCallback();
    }, [processSocialAuthResult]);

    const handleGoogleLogin = () => {
        window.location.href = buildGoogleAuthUrl();
    };

    const handleKakaoLogin = () => {
        window.location.href = buildKakaoAuthUrl();
    };

    // 이미 로그인된 상태로 /login에 접근한 경우 홈으로 즉시 리다이렉트
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex flex-1 justify-center min-h-screen flex-col items-center bg-black-900 pb-[31.875px] pt-[57.84px]">
            <main className="flex flex-1 justify-center max-h-150 flex-col">
                <div className="flex flex-col items-center mb-[200px]">
                    <img
                        src={logoImage}
                        alt="Blankit 로고"
                        className="h-[81.85px] w-[81.66px]"
                    />
                </div>

                <nav
                    aria-label="소셜 로그인"
                    className="flex w-[163px] flex-col items-start gap-5 pb-10"
                >
                    <SocialLoginButton
                        icon={
                            <img src={googleIcon} alt="" className="h-5 w-5" />
                        }
                        label="구글로 로그인"
                        backgroundColor="var(--color-black-100)"
                        textColor="var(--color-black-850)"
                        onClick={handleGoogleLogin}
                    />

                    <SocialLoginButton
                        icon={
                            <img src={kakaoIcon} alt="" className="h-5 w-5" />
                        }
                        label="카카오로 로그인"
                        backgroundColor="#FEE500"
                        textColor="var(--color-black-850)"
                        onClick={handleKakaoLogin}
                    />
                </nav>
            </main>
        </div>
    );
};
