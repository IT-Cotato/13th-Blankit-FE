import type { OnboardingCard } from "@/types/onboarding";
import dummyImage from "@/assets/onboarding/dummy.png";

export const onboardingCards: OnboardingCard[] = [
    {
        id: "0001",
        image: dummyImage,
        title: "과업을 시작하세요",
        content:
            "하고 싶은 과업을 플레이리스트에 담고,\n버닛과 함께 하나씩 채워나가 보세요.",
    },
    {
        id: "0002",
        image: dummyImage,
        title: "어디까지 했는지만 기록해 주세요",
        content: "과업을 마친 뒤 진행률만 알려주세요.",
    },
    {
        id: "0003",
        image: dummyImage,
        title: "지금 가장 필요한 과업을 추천해드려요",
        content:
            "마감일과 진행 상황을 바탕으로\n지금 가장 필요한 과업들을 추천해드려요.",
    },
    {
        id: "0004",
        image: dummyImage,
        title: "오늘 얼마나 해야 하는지 계산해드려요",
        content:
            "남은 기간과 진행 속도를 반영해\n오늘의 권장 시간을 추천해드려요.",
    },
];
