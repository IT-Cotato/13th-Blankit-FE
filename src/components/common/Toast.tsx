interface ToastProps {
  message: string | null;
  aboveBottomNavigation?: boolean;
}

export function Toast({
  message,
  aboveBottomNavigation = false,
}: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className={`
        fixed left-1/2 z-[120]
        flex h-[41px] w-fit min-w-[158px]
        max-w-[calc(100vw-32px)]
        -translate-x-1/2
        items-center justify-center
        whitespace-nowrap
        rounded-[6px]
        border-[1.5px] border-black-800
        bg-black-850
        px-4 py-2.5
        text-center text-[14px] font-medium
        leading-[150%] tracking-[-0.015em]
        text-black-100
        shadow-[0_10px_60px_0_rgba(0,0,0,0.6)]
        ${
          aboveBottomNavigation
            ? "bottom-[calc(102px+env(safe-area-inset-bottom))]"
            : "bottom-4"
        }
      `}
    >
      {message}
    </div>
  );
}
