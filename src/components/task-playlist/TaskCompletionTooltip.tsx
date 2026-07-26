interface TaskCompletionTooltipProps {
  onDismiss: () => void;
}

export function TaskCompletionTooltip({
  onDismiss,
}: TaskCompletionTooltipProps) {
  return (
    <div
      role="presentation"
      onPointerDown={onDismiss}
      className="fixed inset-0 z-[65]"
    >
      <div
        role="tooltip"
        className="absolute bottom-[205px] right-5 max-w-[190px] rounded-[8px] border border-black-700 bg-black-800 px-4 py-3 text-[12px] font-medium leading-[150%] text-black-300 shadow-lg"
      >
        완료한 일을 기록해 보세요.
        <br />
        우측 버튼을 누르면 이동해요.
        <span
          aria-hidden="true"
          className="absolute -bottom-2 right-5 h-4 w-4 rotate-45 border-b border-r border-black-700 bg-black-800"
        />
      </div>
    </div>
  );
}
