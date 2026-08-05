import { useEffect, useState } from "react";

interface VisualViewportState {
  height: number;
  keyboardInset: number;
}

function getVisualViewportState(): VisualViewportState {
  const viewport = window.visualViewport;

  if (!viewport) {
    return {
      height: window.innerHeight,
      keyboardInset: 0,
    };
  }

  return {
    height: viewport.height,
    keyboardInset: Math.max(
      0,
      window.innerHeight - viewport.height - viewport.offsetTop,
    ),
  };
}

export function useVisualViewport() {
  const [state, setState] = useState<VisualViewportState>(() =>
    getVisualViewportState(),
  );

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) {
      return;
    }

    const updateViewport = () => {
      setState(getVisualViewportState());
    };

    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport);
    window.addEventListener("orientationchange", updateViewport);

    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  return state;
}
