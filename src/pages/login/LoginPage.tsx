import googleIcon from "@/assets/icons/login-btn/google-icon.svg";
import kakaoIcon from "@/assets/icons/login-btn/kakaotalk-icon.svg";

import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
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
        <div className="flex min-h-screen flex-col items-center bg-black-900">
            <div className="h-[19.591px] w-full" /> {/* 상단 여백 */}
            <div className="flex flex-1 flex-col items-center justify-center">
                <img
                    src={logoImage}
                    alt="Blankit 로고"
                    className="aspect-square h-[81.85px] w-[81.66px]"
                />
            </div>
            <div className="flex w-[163px] flex-col items-start gap-5 pb-10">
                <SocialLoginButton
                    icon={<img src={googleIcon} alt="" className="h-5 w-5" />}
                    label="구글로 로그인"
                    backgroundColor="var(--color-black-100)"
                    textColor="var(--color-black-850)"
                    onClick={handleGoogleLogin}
                />

                <SocialLoginButton
                    icon={<img src={kakaoIcon} alt="" className="h-5 w-5" />} // 카카오톡 아이콘 대신 구글 아이콘으로 일단 채워넣음
                    label="카카오로 로그인"
                    backgroundColor="#FEE500"
                    textColor="var(--color-black-850)"
                    onClick={handleKakaoLogin}
                />
            </div>
            <div className="h-[31.875px] w-full" /> {/* 하단 여백 */}
        </div>
    );
};
