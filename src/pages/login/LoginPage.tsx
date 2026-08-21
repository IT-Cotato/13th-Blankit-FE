import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import googleIcon from "@/assets/icons/social/google-icon.svg";
import kakaoIcon from "@/assets/icons/social/kakaotalk-icon.svg";
import logoImage from "@/assets/logo/blankit-logo.svg";

import { SocialLoginButton } from "@/components/login/SocialLoginButton";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { useAuthStore } from "@/store/authStore";
import { isValidOauthState } from "@/lib/oauthState";
import { getAuthErrorMessage } from "@/lib/getAuthErrorMessage";
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
import { LoadingOverlay } from "@/components/common/LoadingOverlay";

interface LoginPageProps {
    onShowToast: (message: string) => void;
    onSetToastBottom: (bottom: number | null) => void;
}

export const LoginPage = ({
    onShowToast,
    onSetToastBottom,
}: LoginPageProps) => {
    const navRef = useRef<HTMLElement>(null);

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { processSocialAuthResult } = useSocialAuth();
    const hasRunCallbackRef = useRef(false);
    const navigate = useNavigate();

    const [isProcessingCallback, setIsProcessingCallback] = useState(() => {
        const searchParameters = new URLSearchParams(window.location.search);
        const hasKakaoCode = searchParameters.has("code");
        const hasGoogleIdToken =
            parseGoogleIdTokenFromHash(window.location.hash) !== null;
        return hasKakaoCode || hasGoogleIdToken;
    });

    useEffect(() => {
        const updateToastPosition = () => {
            if (!navRef.current) return;

            const navTop = navRef.current.getBoundingClientRect().top;
            const bottom = window.innerHeight - navTop + 20;

            onSetToastBottom(bottom);
        };

        updateToastPosition();
        window.addEventListener("resize", updateToastPosition);

        return () => {
            window.removeEventListener("resize", updateToastPosition);
            onSetToastBottom(null);
        };
    }, [onSetToastBottom]);

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
                setIsProcessingCallback(false);
                navigate("/login", { replace: true });
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
            } catch (error) {
                setIsProcessingCallback(false);
                onShowToast(getAuthErrorMessage(error));
                navigate("/login", { replace: true });
            }
        };

        handleCallback();
    }, [processSocialAuthResult, navigate, onShowToast]);

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
        <div className="flex h-full min-h-0 flex-col items-center bg-black-900">
            <main className="flex w-full min-h-0 flex-1 flex-col items-center ">
                <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                    <img
                        src={logoImage}
                        alt="Blankit 로고"
                        className="h-[81.85px] w-[81.66px] shrink-0"
                    />
                </div>

                {/* nav: 남는 공간의 나머지를 흡수, 버튼은 nav 하단 정렬 */}
                <nav
                    ref={navRef}
                    aria-label="소셜 로그인"
                    className="flex min-h-0 w-[163px] max-h-[220px] flex-1 flex-col items-center justify-center gap-5 pb-8"
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

            {isProcessingCallback && <LoadingOverlay />}
        </div>
    );
};
