import type { OnboardingCard } from "@/types/onboarding";

interface OnboardingCarouselCardProps {
    card: OnboardingCard;
    cardWidthPx: number;
    isCurrent: boolean;
}

export const OnboardingCarouselCard = ({
    card,
    cardWidthPx,
    isCurrent,
}: OnboardingCarouselCardProps) => {
    return (
        <div
            className="flex h-full min-h-0 shrink-0 flex-col items-center justify-center gap-5"
            style={{ width: `${cardWidthPx}px` }}
            aria-hidden={!isCurrent}
        >
            <div className="flex min-h-0 w-full items-center justify-center">
                <img
                    src={card.image}
                    alt=""
                    draggable={false}
                    className="max-h-full w-auto max-w-full select-none object-contain"
                />
            </div>

            <div className="flex min-h-0 shrink-0 flex-col items-center justify-start gap-3">
                <h1 className="text-center text-[20px] font-semibold text-black-100">
                    {card.title}
                </h1>
                <p className="whitespace-pre-line text-center text-[14px] font-normal leading-[150%] text-black-600">
                    {card.content}
                </p>
            </div>
        </div>
    );
};
