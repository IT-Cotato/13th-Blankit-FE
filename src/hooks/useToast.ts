import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { TOAST_DURATION_MS } from "@/constants/toast";

export function useToast(duration = TOAST_DURATION_MS) {
  const [message, setMessage] =
    useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const hideToast = useCallback(() => {
    setMessage(null);

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (nextMessage: string) => {
      setMessage(nextMessage);

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        setMessage(null);
        timerRef.current = null;
      }, duration);
    },
    [duration],
  );

  useEffect(() => hideToast, [hideToast]);

  return {
    message,
    showToast,
    hideToast,
  };
}
