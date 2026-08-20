interface PackExpectedProgressProps {
  minutes: number;
  increasePercent: number;
}

export function PackExpectedProgress({
  minutes,
  increasePercent,
}: PackExpectedProgressProps) {
  return (
    <div className="inline-flex items-center justify-center gap-0.5 rounded-[8px] bg-black-100 px-3 py-2 font-sans text-[12px] font-medium not-italic leading-[150%] tracking-[-0.18px]">
      <span className="text-center text-black-850">
        {minutes}분 후 예상 진행도
      </span>
      <span className="text-center text-green-600">
        +{increasePercent}%
      </span>
    </div>
  );
}
