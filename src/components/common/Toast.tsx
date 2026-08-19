import { useEffect, useState } from "react";

const TOAST_TRANSITION_MS = 200;

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
    const [renderedMessage, setRenderedMessage] =
        useState<string | null>(message);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let renderFrame: number | undefined;
        let visibilityFrame: number | undefined;
        let removalTimer: number | undefined;

        if (message) {
            renderFrame = window.requestAnimationFrame(() => {
                setRenderedMessage(message);
                visibilityFrame = window.requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            renderFrame = window.requestAnimationFrame(() => {
                setIsVisible(false);
            });
            removalTimer = window.setTimeout(() => {
                setRenderedMessage(null);
            }, TOAST_TRANSITION_MS);
        }

        return () => {
            if (renderFrame !== undefined) {
                window.cancelAnimationFrame(renderFrame);
            }
            if (visibilityFrame !== undefined) {
                window.cancelAnimationFrame(visibilityFrame);
            }
            if (removalTimer !== undefined) {
                window.clearTimeout(removalTimer);
            }
        };
    }, [message]);

    if (!renderedMessage) {
        return null;
    }

    return (
        <>
            {centeredWithBackdrop && (
                <div
                    aria-hidden="true"
                    className={`fixed inset-0 z-[59] bg-black transition-opacity duration-200 ${
                        isVisible ? "opacity-70" : "opacity-0"
                    }`}
                />
            )}

            <div
                role="status"
                aria-live={variant === "taskCombination" ? "polite" : undefined}
                style={
                    variant === "taskCombination"
                        ? undefined
                        : {
                              ...(variant === "login" && bottom !== null
                                  ? { bottom: `${bottom}px` }
                                  : {}),
                              transition: isVisible
                                  ? "transform 200ms ease-out, opacity 200ms ease-out"
                                  : "opacity 180ms ease-in",
                          }
                }
                className={
                    variant === "taskCombination"
                        ? `fixed left-1/2 z-[60] -translate-x-1/2 whitespace-pre-line rounded-[6px] border border-black-750 bg-black-800 px-4 py-3 text-center text-[13px] font-medium text-black-200 shadow-lg transition-opacity duration-200 ${
                              isVisible ? "opacity-100" : "opacity-0"
                          } ${
                              centeredWithBackdrop
                                  ? "top-1/2 -translate-y-1/2"
                                  : "bottom-[190px]"
                          }`
                        : `
    fixed left-1/2 z-[120]
    flex min-h-[41px] w-max min-w-[158px]
    -translate-x-1/2
    items-center justify-center
    rounded-[6px]
    border-[1.5px] border-black-800
    bg-black-850
    px-4 py-2.5
    text-center font-sans text-[14px] font-medium not-italic
    leading-[150%] tracking-[-0.21px]
    text-black-100
    shadow-[0_10px_60px_0_rgba(0,0,0,0.6)]
    translate-y-0
    ${isVisible ? "opacity-100" : "opacity-0"}
    ${
        variant === "login"
            ? `${
                  bottom === null ? "bottom-[130px]" : ""
              } max-w-[calc(100vw-16px)] whitespace-pre-line`
            : `${
                  aboveBottomNavigation
                      ? "bottom-[calc(102px+env(safe-area-inset-bottom))]"
                      : "bottom-4"
              } max-w-[calc(100vw-32px)] whitespace-nowrap`
    }
`
                }
            >
                {renderedMessage}
            </div>
        </>
    );
}
