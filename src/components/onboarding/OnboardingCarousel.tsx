import { useCallback, useEffect, useRef, useState } from "react";
import type { OnboardingCard } from "@/types/onboarding";

import { OnboardingCarouselCard } from "./OnboardingCarouselCard";

const MAX_CARD_WIDTH_PX = 355;
const SWIPE_THRESHOLD_PX = 50;

const clampIndex = (index: number, maxIndex: number) => {
    return Math.min(Math.max(index, 0), maxIndex);
};

interface OnboardingCarouselProps {
    className?: string;
    cards: OnboardingCard[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
}

export const OnboardingCarousel = ({
    className,
    cards,
    currentIndex,
    onIndexChange,
}: OnboardingCarouselProps) => {
    const dragStartXRef = useRef(0);
    const dragOffsetPxRef = useRef(0);
    const [dragOffsetPx, setDragOffsetPx] = useState(0);
    const [isMouseDragging, setIsMouseDragging] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // 뷰포트 실측 너비 (355px을 넘지 않는 선에서 화면에 맞춤)
    const viewportRef = useRef<HTMLDivElement>(null);
    const [cardWidthPx, setCardWidthPx] = useState(MAX_CARD_WIDTH_PX);

    useEffect(() => {
        const el = viewportRef.current?.parentElement; // 컨테이너(className 적용된 최상위) 기준으로 측정
        if (!el) return;

        const updateWidth = (containerWidth: number) => {
            setCardWidthPx(Math.min(MAX_CARD_WIDTH_PX, containerWidth));
        };

        updateWidth(el.clientWidth);

        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            const width = entry.contentRect.width;
            updateWidth(width);
        });

        resizeObserver.observe(el);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const finishDrag = useCallback(
        (diffX: number) => {
            setIsDragging(false);
            setDragOffsetPx(0);

            if (cards.length === 0) {
                return;
            }

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

    const translateXPx = -(currentIndex * cardWidthPx) + dragOffsetPx;

    return (
        <div
            className={`flex h-full min-h-0 w-full flex-col items-center overflow-hidden ${className ?? ""}`}
            role="group"
            aria-roledescription="carousel"
            aria-label="소개 슬라이드"
        >
            <div
                ref={viewportRef}
                className="min-h-0 w-full max-w-[355px] flex-1 select-none overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
            >
                <div
                    className={`flex h-full min-h-0 ${
                        isDragging
                            ? ""
                            : "transition-transform duration-300 ease-in-out"
                    }`}
                    style={{
                        width: `${cardWidthPx * cards.length}px`,
                        transform: `translateX(${translateXPx}px)`,
                    }}
                >
                    {cards.map((card, index) => (
                        <OnboardingCarouselCard
                            key={card.id}
                            card={card}
                            cardWidthPx={cardWidthPx}
                            isCurrent={index === currentIndex}
                        />
                    ))}
                </div>
            </div>
            <div
                className="flex gap-2 pb-5 pt-5"
                role="tablist"
                aria-label="온보딩 진행 상태"
            >
                {cards.map((card, index) => (
                    <span
                        key={card.id}
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
