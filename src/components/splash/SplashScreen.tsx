import { useEffect } from "react";

import splashGif from "../../assets/gifs/splash.gif";

interface SplashScreenProps {
    onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
    useEffect(() => {
        const timerId = setTimeout(() => {
            onFinish();
        }, 2000);

        return () => clearTimeout(timerId);
    }, [onFinish]);

    return (
        <div
            className="flex h-dvh flex-col overflow-y-auto bg-black-900"
            style={{
                paddingTop: "env(safe-area-inset-top)",
                paddingBottom: "env(safe-area-inset-bottom)",
            }}
        >
            <div className="flex min-h-0 flex-1 items-center justify-center">
                <img
                    src={splashGif}
                    alt="Blankit 로고"
                    className="h-[min(192px,28dvh)] w-[min(192px,28dvh)]"
                />
            </div>
            <p className="flex-shrink-0 pb-17.5 text-center text-[14px] font-normal leading-[150%] tracking-[-0.21px] text-black-650">
                @Blankit
            </p>
        </div>
    );
};
