import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";

import { useElementRectValue } from "./useElementRectValue";
import { useVisualViewport } from "./useVisualViewport";

const NAV_BAR_HEIGHT_PX = 90; // BottomNavigation은 border-box라 항상 이 값으로 고정
const COLLAPSED_HEIGHT_FALLBACK_PX = 357;
const MIN_COLLAPSED_HEIGHT_PX = 96;
const COLLAPSED_GAP_ABOVE_PX = 20; // 최소화 상태일 때 CalendarGrid와 띄울 간격

const BIG_DRAG_DISTANCE_PX = 220; // 이 이상 드래그하면 중간 단계를 건너뜁니다
const BIG_DRAG_VELOCITY = 0.8; // px/ms — 빠르게 스와이프해도 건너뜁니다

const SNAP_ORDER = ["collapsed", "half", "full"] as const;
export type SheetSnapPoint = (typeof SNAP_ORDER)[number];

interface SnapHeights {
    collapsed: number;
    half: number;
    full: number;
}

const clampIndex = (index: number) => {
    return Math.min(Math.max(index, 0), SNAP_ORDER.length - 1);
};

// env(safe-area-inset-top) 값을 실제 px로 읽어옵니다.
// (CSS 변수라 JS에서 직접 값을 못 읽기 때문에 숨김 엘리먼트로 측정)
const readSafeAreaInsetTop = () => {
    if (typeof document === "undefined") return 0;

    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.top = "0";
    probe.style.left = "0";
    probe.style.height = "env(safe-area-inset-top, 0px)";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";

    document.body.appendChild(probe);
    const value = probe.getBoundingClientRect().height;
    document.body.removeChild(probe);

    return value;
};

const useSafeAreaInsetTop = () => {
    const [safeAreaTop, setSafeAreaTop] = useState(0);

    useEffect(() => {
        const update = () => setSafeAreaTop(readSafeAreaInsetTop());
        update();

        window.addEventListener("resize", update);
        window.addEventListener("orientationchange", update);
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("orientationchange", update);
        };
    }, []);

    return safeAreaTop;
};

const computeSnapHeights = ({
    viewportHeight,
    navBarHeight,
    safeAreaTop,
    calendarBottom,
}: {
    viewportHeight: number;
    navBarHeight: number;
    safeAreaTop: number;
    calendarBottom: number;
}): SnapHeights => {
    // full 상태: 상단은 safe area만큼만 남기고 나머지는 시트가 다 채웁니다.
    const fullHeight = viewportHeight - safeAreaTop - navBarHeight;
    const halfHeight = viewportHeight * 0.5 - navBarHeight;

    // 캘린더 그리드 바로 아래부터 네비게이션 바 상단까지의 여백에서
    // 최소화 상태일 때 그리드와 띄울 간격(20px)을 뺍니다.
    const spaceBelowCalendar =
        calendarBottom > 0
            ? viewportHeight -
              navBarHeight -
              calendarBottom -
              COLLAPSED_GAP_ABOVE_PX
            : COLLAPSED_HEIGHT_FALLBACK_PX; // 아직 측정 전이면 기존 고정값 사용

    const collapsedHeight = Math.max(
        Math.min(spaceBelowCalendar, halfHeight),
        MIN_COLLAPSED_HEIGHT_PX,
    );

    return {
        collapsed: collapsedHeight,
        half: Math.max(halfHeight, collapsedHeight),
        full: Math.max(fullHeight, halfHeight),
    };
};

interface UseBottomSheetSnapOptions {
    contentBottomSelector: string;
}

// 하단 시트의 스냅포인트(collapsed/half/full) 전환과 드래그 제스처를 관리하는 훅.
// 콘텐츠 하단 위치와 safe area를 측정해 캘린더를 가리지 않고,
// full 상태에서는 상단 safe area만큼만 여백을 남기도록 높이를 계산합니다.
export const useBottomSheetSnap = ({
    contentBottomSelector,
}: UseBottomSheetSnapOptions) => {
    const [currentSnapPoint, setCurrentSnapPoint] =
        useState<SheetSnapPoint>("collapsed");
    const [dragHeight, setDragHeight] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const { height: viewportHeight, keyboardInset } = useVisualViewport();
    const safeAreaTop = useSafeAreaInsetTop();

    const contentBottom = useElementRectValue(
        contentBottomSelector,
        (rect) => rect.bottom,
        0,
    );
    const effectiveNavBarHeight = NAV_BAR_HEIGHT_PX + keyboardInset;

    const snapHeights = useMemo(
        () =>
            computeSnapHeights({
                viewportHeight,
                navBarHeight: effectiveNavBarHeight,
                safeAreaTop,
                calendarBottom: contentBottom,
            }),
        [viewportHeight, effectiveNavBarHeight, safeAreaTop, contentBottom],
    );

    const dragStartRef = useRef<{
        pointerId: number;
        startY: number;
        startHeight: number;
        startSnapPoint: SheetSnapPoint;
    } | null>(null);
    const lastMoveRef = useRef<{ y: number; time: number } | null>(null);
    const velocityRef = useRef(0);
    const didDragRef = useRef(false);

    const clampHeight = (height: number) => {
        return Math.min(
            Math.max(height, snapHeights.collapsed),
            snapHeights.full,
        );
    };

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        const startHeight = dragHeight ?? snapHeights[currentSnapPoint];
        didDragRef.current = false;

        dragStartRef.current = {
            pointerId: event.pointerId,
            startY: event.clientY,
            startHeight,
            startSnapPoint: currentSnapPoint,
        };
        lastMoveRef.current = { y: event.clientY, time: performance.now() };
        velocityRef.current = 0;

        setIsDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        const dragStart = dragStartRef.current;
        if (!dragStart || event.pointerId !== dragStart.pointerId) return;

        const deltaY = dragStart.startY - event.clientY;
        if (Math.abs(deltaY) > 4) {
            didDragRef.current = true;
        }
        setDragHeight(clampHeight(dragStart.startHeight + deltaY));

        const now = performance.now();
        const lastMove = lastMoveRef.current;
        if (lastMove) {
            const elapsedTime = now - lastMove.time;
            if (elapsedTime > 0) {
                velocityRef.current =
                    (lastMove.y - event.clientY) / elapsedTime;
            }
        }
        lastMoveRef.current = { y: event.clientY, time: now };
    };

    const finishDrag = () => {
        dragStartRef.current = null;
        lastMoveRef.current = null;
        setDragHeight(null);
        setIsDragging(false);
    };

    const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        const dragStart = dragStartRef.current;
        if (!dragStart || event.pointerId !== dragStart.pointerId) return;

        const finalHeight = dragHeight ?? dragStart.startHeight;
        const distance = finalHeight - dragStart.startHeight;
        const velocity = velocityRef.current;

        const startIndex = SNAP_ORDER.indexOf(dragStart.startSnapPoint);
        const direction = distance > 0 ? 1 : distance < 0 ? -1 : 0;

        let targetIndex = startIndex;

        if (direction !== 0) {
            const isBigMove =
                Math.abs(distance) > BIG_DRAG_DISTANCE_PX ||
                Math.abs(velocity) > BIG_DRAG_VELOCITY;

            targetIndex = isBigMove
                ? direction > 0
                    ? SNAP_ORDER.length - 1
                    : 0
                : clampIndex(startIndex + direction);
        }

        setCurrentSnapPoint(SNAP_ORDER[targetIndex]);
        finishDrag();
    };

    const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (
            !dragStartRef.current ||
            event.pointerId !== dragStartRef.current.pointerId
        ) {
            return;
        }
        finishDrag();
    };

    // 드래그 없이 짧게 탭했을 때: 핸들(상단 스크롤바) 영역을 누르면 최소화됩니다.
    const handleHandleClick = () => {
        if (isDragging || didDragRef.current) {
            didDragRef.current = false;
            return;
        }

        setCurrentSnapPoint("collapsed");
    };

    return {
        navBarHeight: effectiveNavBarHeight,
        sheetHeight: dragHeight ?? snapHeights[currentSnapPoint],
        isDragging,
        isFull: currentSnapPoint === "full",
        dragHandleProps: {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerCancel: handlePointerCancel,
            onClick: handleHandleClick,
        },
    };
};
