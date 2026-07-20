// src/components/onboarding/OnboardingCarousel.tsx
import { useRef } from "react";
import type { OnboardingCard } from "@/types/onboarding";

const SWIPE_THRESHOLD_PX = 50;

interface OnboardingCarouselProps {
    cards: OnboardingCard[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
}

export const OnboardingCarousel = ({
    cards,
    currentIndex,
    onIndexChange,
}: OnboardingCarouselProps) => {
    const dragStartXRef = useRef(0);

    const moveToIndexByDiff = (diffX: number) => {
        if (diffX > SWIPE_THRESHOLD_PX && currentIndex < cards.length - 1) {
            onIndexChange(currentIndex + 1);
        }

        if (diffX < -SWIPE_THRESHOLD_PX && currentIndex > 0) {
            onIndexChange(currentIndex - 1);
        }
    };

    const handleTouchStart = (event: React.TouchEvent) => {
        dragStartXRef.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: React.TouchEvent) => {
        const touchEndX = event.changedTouches[0].clientX;
        moveToIndexByDiff(dragStartXRef.current - touchEndX);
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        dragStartXRef.current = event.clientX;
    };

    const handleMouseUp = (event: React.MouseEvent) => {
        moveToIndexByDiff(dragStartXRef.current - event.clientX);
    };

    const currentCard = cards[currentIndex];

    return (
        <div
            className="flex flex-1 flex-col items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <img
                src={currentCard.image}
                alt=""
                className="mb-8 aspect-[3/4] w-full max-w-[280px] rounded-2xl bg-black-800 object-cover"
            />

            <h1 className="text-center text-[20px] font-bold text-black-100">
                {currentCard.title}
            </h1>

            <p className="mt-3 whitespace-pre-line text-center text-[14px] font-medium leading-[150%] text-black-600">
                {currentCard.content}
            </p>

            <div className="mt-6 flex gap-2">
                {cards.map((card, index) => (
                    <span
                        key={card.id}
                        className={`h-2 w-2 rounded-full ${
                            index === currentIndex
                                ? "bg-black-100"
                                : "bg-black-700"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};
