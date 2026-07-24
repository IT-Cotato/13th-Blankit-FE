import type { OnboardingCard } from "@/types/onboarding";

const CARD_IMAGE_HEIGHT_PX = 363;
const CARD_IMAGE_WIDTH_PX = 234;
const TEXT_WRAPPER_HEIGHT_PX = 90;

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
                alt={card.title}
                draggable={false}
                className="mb-1 select-none object-cover"
                style={{
                    width: `${CARD_IMAGE_WIDTH_PX}px`,
                    height: `${CARD_IMAGE_HEIGHT_PX}px`,
                }}
            />

            <div
                className="flex flex-col items-center justify-start gap-3"
                style={{ height: `${TEXT_WRAPPER_HEIGHT_PX}px` }}
            >
                <h1 className="text-center text-[20px] font-semibold text-black-100">
                    {card.title}
                </h1>

                <p className="select-none whitespace-pre-line text-center text-[14px] font-normal leading-[150%] text-black-600">
                    {card.content}
                </p>
            </div>
        </div>
    );
};
