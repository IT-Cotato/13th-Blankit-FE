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
            <OnboardingCarousel
                cards={onboardingCards}
                currentIndex={currentIndex}
                onIndexChange={setCurrentIndex}
            />

            <button
                type="button"
                onClick={handleStartClick}
                disabled={!isLastCard}
                className={`h-[52px] w-full rounded-lg text-[16px] font-bold ${
                    isLastCard
                        ? "bg-black-100 text-black-900"
                        : "bg-black-800 text-black-600"
                }`}
            >
                시작하기
            </button>

            <p className="mt-4 text-center text-[13px] text-black-600">
                이미 계정이 있으신가요?{" "}
                <button
                    type="button"
                    onClick={handleLoginLinkClick}
                    className="font-medium text-black-100 underline"
                >
                    바로 로그인하세요
                </button>
            </p>
        </div>
    );
};
