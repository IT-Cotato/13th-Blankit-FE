import googleIcon from "@/assets/icons/login-btn/google-icon.svg";
import kakaoIcon from "@/assets/icons/login-btn/kakaotalk-icon.svg";

import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import logoImage from "@/assets/logo/blankit-logo.svg";
import logoLabel from "@/assets/logo/Blankit-logo-label.svg";

export const LoginPage = () => {
    const handleGoogleLogin = () => {
        // TODO: 구글 로그인 연동
        console.log("구글 로그인 클릭");
    };

    const handleKakaoLogin = () => {
        // TODO: 카카오 로그인 연동
        console.log("카카오 로그인 클릭");
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-black-900">
            <div className="h-[57.84px] w-full flex-1" aria-hidden="true" />

            <main className="flex flex-col">
                <div className="flex max-h-36 min-h-10 flex-1 flex-col items-center justify-end gap-5">
                    <img
                        src={logoImage}
                        alt="Blankit 로고"
                        className="aspect-square h-[81.85px] w-[81.66px]"
                    />

                    <img
                        src={logoLabel}
                        alt="Blankit"
                        className="aspect-square h-[24px] w-[90px]"
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

            <div className="h-[31.875px] w-full flex-1" aria-hidden="true" />
        </div>
    );
};
