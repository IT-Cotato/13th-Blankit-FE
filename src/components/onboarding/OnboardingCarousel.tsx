import { useRef } from "react";
import type { OnboardingCard } from "@/types/onboarding";

const SWIPE_THRESHOLD_PX = 50;
const TEXT_WRAPPER_HEIGHT_PX = 90;

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
            className="flex flex-col items-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <img
                src={currentCard.image}
                alt=""
                className="mb-1 h-[363px] w-[234px]  object-cover"
            />

            <div
                className="flex flex-col items-center justify-start gap-3"
                style={{ height: `${TEXT_WRAPPER_HEIGHT_PX}px` }}
            >
                <h1 className="text-center text-[20px] font-semibold text-black-100">
                    {currentCard.title}
                </h1>

                <p className="whitespace-pre-line text-center text-[14px] font-normal leading-[150%] text-black-600">
                    {currentCard.content}
                </p>
            </div>

            <div className="mt-16 flex gap-2 pb-5">
                {cards.map((card, index) => (
                    <span
                        key={card.id}
                        className={`h-2 w-2 rounded-full ${
                            index === currentIndex
                                ? "bg-black-650"
                                : "bg-black-800"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};
