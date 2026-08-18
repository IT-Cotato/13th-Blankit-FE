import { useRef } from "react";

import type { PointerEvent as ReactPointerEvent } from "react";

interface UseDragScrollOptions {
    threshold?: number;
}

export function useDragScroll({ threshold = 12 }: UseDragScrollOptions = {}) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({
        pointerId: -1,
        startX: 0,
        scrollLeft: 0,
        dragged: false,
        captured: false,
    });

    function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        const scroller = scrollerRef.current;

        if (!scroller || scroller.scrollWidth <= scroller.clientWidth) {
            dragRef.current.pointerId = -1;
            return;
        }

        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            scrollLeft: scroller.scrollLeft,
            dragged: false,
            captured: false,
        };
    }

    function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        const scroller = scrollerRef.current;
        const drag = dragRef.current;

        if (!scroller || drag.pointerId !== event.pointerId) {
            return;
        }

        const distance = drag.startX - event.clientX;

        if (!drag.dragged && Math.abs(distance) > threshold) {
            drag.dragged = true;

            if (!drag.captured) {
                scroller.setPointerCapture(event.pointerId);
                drag.captured = true;
            }
        }

        if (drag.dragged) {
            scroller.scrollLeft = drag.scrollLeft + distance;
        }
    }

    function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
        const scroller = scrollerRef.current;
        const drag = dragRef.current;

        if (drag.captured && scroller?.hasPointerCapture(event.pointerId)) {
            scroller.releasePointerCapture(event.pointerId);
        }

        dragRef.current.pointerId = -1;
        dragRef.current.captured = false;
        window.setTimeout(() => {
            dragRef.current.dragged = false;
        }, 0);
    }

    function onClickCapture(event: ReactPointerEvent<HTMLDivElement>) {
        if (dragRef.current.dragged) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    return {
        scrollerRef,
        dragHandlers: {
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onPointerCancel: onPointerUp,
            onClickCapture,
        },
    };
}
