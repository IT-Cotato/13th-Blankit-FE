import { useEffect, useRef, useState } from "react";

// h-1.5 w-1.5 = 6px, gap-[2px] = 2px — CalendarDayButton의 점 스타일과 반드시 동기화되어야 함
const DOT_SIZE_PX = 6;
const DOT_GAP_PX = 2;

export const useMaxVisibleDots = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [maxDots, setMaxDots] = useState(4);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        // 점 n개의 전체 폭 = n*DOT_SIZE_PX + (n-1)*DOT_GAP_PX
        // 이 값이 컨테이너 폭을 넘지 않는 최대 n을 계산
        const calculateMaxDots = (width: number) => {
            const rawMax = Math.floor(
                (width + DOT_GAP_PX) / (DOT_SIZE_PX + DOT_GAP_PX),
            );
            return Math.max(1, rawMax);
        };

        setMaxDots(calculateMaxDots(element.getBoundingClientRect().width));

        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            setMaxDots(calculateMaxDots(entry.contentRect.width));
        });

        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, []);

    return { containerRef, maxDots };
};
