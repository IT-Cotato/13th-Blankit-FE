interface ToastProps {
    message: string | null;
    aboveBottomNavigation?: boolean;
    variant?: "default" | "taskCombination" | "login";
    centeredWithBackdrop?: boolean;
    bottom?: number | null;
}

export function Toast({
    message,
    aboveBottomNavigation = false,
    variant = "default",
    centeredWithBackdrop = false,
    bottom = null,
}: ToastProps) {
    if (!message) {
        return null;
    }

    return (
        <>
            {centeredWithBackdrop && (
                <div
                    aria-hidden="true"
                    className="fixed inset-0 z-[59] bg-black opacity-70"
                />
            )}

            <div
                role="status"
                aria-live={variant === "taskCombination" ? "polite" : undefined}
                style={
                    variant === "login" && bottom !== null
                        ? { bottom: `${bottom}px` }
                        : undefined
                }
                className={
                    variant === "taskCombination"
                        ? `fixed left-1/2 z-[60] -translate-x-1/2 whitespace-pre-line rounded-[6px] border border-black-750 bg-black-800 px-4 py-3 text-center text-[13px] font-medium text-black-200 shadow-lg ${
                              centeredWithBackdrop
                                  ? "top-1/2 -translate-y-1/2"
                                  : "bottom-[190px]"
                          }`
                        : `
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
                  variant === "login"
                      ? bottom === null
                          ? "bottom-[130px]"
                          : ""
                      : aboveBottomNavigation
                        ? "bottom-[calc(102px+env(safe-area-inset-bottom))]"
                        : "bottom-4"
              }
            `
                }
            >
                {message}
            </div>
        </>
    );
}
