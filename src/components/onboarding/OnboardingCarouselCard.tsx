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
            className="flex shrink-0 flex-col items-center"
            style={{ width: `${cardWidthPx}px` }}
            aria-hidden={!isCurrent}
        >
            <img
                src={card.image}
                alt=""
                draggable={false}
                className="mb-1 select-none object-contain h-[363px] w-[234px]"
            />

            <div className="flex flex-col items-center justify-start gap-3 min-h-[90px]">
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
