import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { OnboardingCarousel } from "@/components/onboarding/OnboardingCarousel";
import { onboardingCards } from "@/data/onboardingCards";

export const OnboardingPage = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const isLastCard = currentIndex === onboardingCards.length - 1;

    const handleStartClick = () => {
        navigate("/login");
    };

    const handleLoginLinkClick = () => {
        navigate("/login");
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
                    onClick={handleStartClick}
                    disabled={!isLastCard}
                    className={`h-[48px] w-[312px] rounded-lg text-[14px] ${
                        isLastCard
                            ? "bg-green-500 text-black-900 font-semibold"
                            : "bg-black-800 text-black-600"
                    }`}
                >
                    시작하기
                </button>

                <p className="text-center text-[13px] text-black-600">
                    이미 계정이 있으신가요?{" "}
                    <button
                        type="button"
                        onClick={handleLoginLinkClick}
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
