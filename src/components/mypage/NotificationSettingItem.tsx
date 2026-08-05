type NotificationSettingItemProps = {
  name: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
};

export function NotificationSettingItem({
  name,
  description,
  enabled,
  onToggle,
}: NotificationSettingItemProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="min-w-0 flex-1 pr-4">
        <h2 className="w-full text-base font-medium leading-6 tracking-[-0.24px] text-black-100">
          {name}
        </h2>
        <p className="mt-0.5 text-xs font-normal leading-[18px] tracking-[-0.18px] text-black-700">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${name} ${enabled ? "끄기" : "켜기"}`}
        onClick={onToggle}
        className={`relative flex h-8 w-[54px] shrink-0 items-center gap-2.5 rounded-[20px] p-[3px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 ${
          enabled ? "bg-green-500" : "bg-black-800"
        }`}
      >
        <img
          src={enabled ? "/mypage/on.svg" : "/mypage/off.svg"}
          alt=""
          aria-hidden="true"
          className={
            enabled
              ? "absolute inset-0 h-8 w-[54px]"
              : "h-[26px] w-[26px] shrink-0"
          }
        />
      </button>
    </div>
  );
}
