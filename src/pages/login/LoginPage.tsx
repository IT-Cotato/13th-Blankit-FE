import googleIcon from "@/assets/icons/social/google-icon.svg";
import kakaoIcon from "@/assets/icons/social/kakaotalk-icon.svg";

import { SocialLoginButton } from "@/components/login/SocialLoginButton";
import logoImage from "@/assets/logo/blankit-logo.svg";

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
