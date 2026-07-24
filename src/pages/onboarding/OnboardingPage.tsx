import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { OnboardingCarousel } from "@/components/onboarding/OnboardingCarousel";
import { onboardingCards } from "@/data/onboardingCards";

export const OnboardingPage = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const isLastCard = currentIndex === onboardingCards.length - 1;

    const handleNavigateToLogin = () => {
        navigate("/login");
    };

    const handleActionButtonClick = () => {
        if (isLastCard) {
            handleNavigateToLogin();
            return;
        }

        setCurrentIndex((previousIndex) => previousIndex + 1);
    };

    return (
        <div className="flex min-h-screen flex-col bg-black-900 px-5 py-6">
            <div className="h-[19.591px] w-full flex-1" /> {/* 상단 여백 */}
            <OnboardingCarousel
                cards={onboardingCards}
                currentIndex={currentIndex}
                onIndexChange={setCurrentIndex}
            />
            <div className="flex flex-col items-center gap-4">
                <button
                    type="button"
                    onClick={handleActionButtonClick}
                    aria-label={
                        isLastCard
                            ? "온보딩 완료하고 시작하기"
                            : "다음 온보딩 카드로 이동"
                    }
                    className="h-[48px] w-[312px] rounded-lg bg-green-500 text-[14px] font-semibold text-black-900"
                >
                    {isLastCard ? "시작하기" : "다음"}
                </button>

                <p className="text-center text-[13px] text-black-600">
                    이미 계정이 있으신가요?{" "}
                    <button
                        type="button"
                        onClick={handleNavigateToLogin}
                        className="font-semibold text-green-500"
                    >
                        바로 로그인하세요
                    </button>
                </p>
            </div>
            <div className="h-[31.875px] w-full flex-1" /> {/* 하단 여백 */}
        </div>
    );
};
