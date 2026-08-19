import { useNavigate, useSearchParams } from "react-router-dom";

import { MyPageDetailTopBar } from "@/components/mypage/MyPageDetailTopBar";

const DEFAULT_AVAILABLE_MINUTES = 30;
const PREVIEW_RECOMMENDED_TASK_COUNT = 3;

function parseAvailableMinutes(value: string | null) {
  if (value === null) {
    return DEFAULT_AVAILABLE_MINUTES;
  }

  const minutes = Number(value);

  return Number.isInteger(minutes) && minutes >= 10 && minutes <= 30
    ? minutes
    : DEFAULT_AVAILABLE_MINUTES;
}

export function PackNoti() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const availableMinutes = parseAvailableMinutes(
    searchParams.get("availableMinutes"),
  );
  const currentTaskNumber = 1;

  return (
    <div className="min-h-dvh bg-black-900 text-black-100">
      <MyPageDetailTopBar
        title={`${availableMinutes}분 Pack!`}
        onBack={() => navigate("/")}
        titleClassName="text-lg leading-[27px] tracking-[-0.27px]"
      />

      <main
        aria-label={`${availableMinutes}분 Pack 추천`}
        className="px-5 pt-[41px]"
      >
        <p
          aria-label={`${PREVIEW_RECOMMENDED_TASK_COUNT}개 추천 중 ${currentTaskNumber}번째 과업`}
          className="flex items-stretch font-sans font-semibold not-italic leading-[150%]"
        >
          <span className="inline-flex self-stretch items-center text-[18px] tracking-[-0.27px] text-black-100">
            {currentTaskNumber}
          </span>
          <span className="text-[24px] tracking-[-0.36px] text-black-700">
            /{PREVIEW_RECOMMENDED_TASK_COUNT}
          </span>
        </p>
      </main>
    </div>
  );
}
