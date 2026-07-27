import { AnchoredTooltip } from "./AnchoredTooltip";

interface TaskCompletionTooltipProps {
  onDismiss: () => void;
}

export function TaskCompletionTooltip({
  onDismiss,
}: TaskCompletionTooltipProps) {
  return (
    <AnchoredTooltip
      onDismiss={onDismiss}
      dialogLabel="최초 진입 안내"
      closeLabel="최초 진입 안내 닫기"
    >
      완료한 일을 기록해 보세요.
      <br />
      우선순위를 추천해 드릴게요.
    </AnchoredTooltip>
  );
}
