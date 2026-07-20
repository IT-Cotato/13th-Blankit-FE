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
        <div className="flex min-h-screen flex-col bg-black-900">
            <div className="h-[19.591px] w-full" /> {/* 상단 여백 */}
            <div className="flex flex-1 items-center justify-center">
                <img
                    src={splashGif}
                    alt="Blankit 로고"
                    className="h-[192px] w-[192px]"
                />
            </div>
            <p className="pb-6 text-center text-[14px] font-normal leading-[150%] tracking-[-0.21px] text-black-650">
                @Blankit
            </p>
            <div className="h-[31.875px] w-full" /> {/* 하단 여백 */}
        </div>
    );
};
