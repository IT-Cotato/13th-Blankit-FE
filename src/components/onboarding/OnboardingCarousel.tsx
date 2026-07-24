import { useCallback, useEffect, useRef, useState } from "react";
import type { OnboardingCard } from "@/types/onboarding";

import { OnboardingCarouselCard } from "./OnboardingCarouselCard";

const CARD_WIDTH_PX = 450;
const SWIPE_THRESHOLD_PX = 50;

const clampIndex = (index: number, maxIndex: number) => {
    return Math.min(Math.max(index, 0), maxIndex);
};

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
    const dragOffsetPxRef = useRef(0);
    const [dragOffsetPx, setDragOffsetPx] = useState(0);
    const [isMouseDragging, setIsMouseDragging] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const finishDrag = useCallback(
        (diffX: number) => {
            setIsDragging(false);
            setDragOffsetPx(0);

            const maxIndex = cards.length - 1;

            if (diffX > SWIPE_THRESHOLD_PX) {
                onIndexChange(clampIndex(currentIndex - 1, maxIndex));
            } else if (diffX < -SWIPE_THRESHOLD_PX) {
                onIndexChange(clampIndex(currentIndex + 1, maxIndex));
            }
        },
        [currentIndex, cards.length, onIndexChange],
    );

    // 모바일 터치 드래그
    const handleTouchStart = (event: React.TouchEvent) => {
        dragStartXRef.current = event.touches[0].clientX;
        setIsDragging(true);
    };

    const handleTouchMove = (event: React.TouchEvent) => {
        const currentX = event.touches[0].clientX;
        setDragOffsetPx(currentX - dragStartXRef.current);
    };

    const handleTouchEnd = (event: React.TouchEvent) => {
        const touchEndX = event.changedTouches[0].clientX;
        finishDrag(touchEndX - dragStartXRef.current);
    };

    // 웹 마우스 드래그
    const handleMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();

        dragStartXRef.current = event.clientX;
        dragOffsetPxRef.current = 0;
        setIsDragging(true);
        setIsMouseDragging(true);
    };

    // 마우스 드래그 중 window 리스너를 useEffect로 등록/정리
    useEffect(() => {
        if (!isMouseDragging) return;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const offset = moveEvent.clientX - dragStartXRef.current;
            dragOffsetPxRef.current = offset;
            setDragOffsetPx(offset);
        };

        const handleMouseUp = () => {
            finishDrag(dragOffsetPxRef.current);
            setIsMouseDragging(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isMouseDragging, finishDrag]);

    const translateXPx = -(currentIndex * CARD_WIDTH_PX) + dragOffsetPx;

    return (
        <div
            className="flex flex-col items-center"
            role="group"
            aria-roledescription="carousel"
            aria-label="소개 슬라이드"
        >
            <div
                className="select-none overflow-hidden"
                style={{ width: `${CARD_WIDTH_PX}px` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
            >
                <div
                    className={`flex ${
                        isDragging
                            ? ""
                            : "transition-transform duration-300 ease-in-out"
                    }`}
                    style={{
                        width: `${CARD_WIDTH_PX * cards.length}px`,
                        transform: `translateX(${translateXPx}px)`,
                    }}
                >
                    {cards.map((card, index) => (
                        <OnboardingCarouselCard
                            key={card.id}
                            card={card}
                            cardWidthPx={CARD_WIDTH_PX}
                            isCurrent={index === currentIndex}
                        />
                    ))}
                </div>
            </div>

            <div
                className="mt-16 flex gap-2 pb-5"
                role="tablist"
                aria-label="온보딩 진행 상태"
            >
                {cards.map((card, index) => (
                    <span
                        key={card.id}
                        role="tab"
                        aria-selected={index === currentIndex}
                        aria-label={`${index + 1}번째 카드`}
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
