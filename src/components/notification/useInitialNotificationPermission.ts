import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getNotificationSettings,
  registerPushSubscription,
  updateNotificationSettings,
} from "@/api/mypage/notifications";
import { requestFcmRegistration } from "@/firebase/messaging";
import { useAuthStore } from "@/store/authStore";

import {
  clearInitialNotificationPermission,
  hasInitialNotificationPermission,
} from "./notificationPermissionStorage";

const SUBSCRIPTION_ID_STORAGE_KEY =
  "blankit-push-subscription-id";

interface UseInitialNotificationPermissionOptions {
  onShowToast: (message: string) => void;
}

function getBrowserName() {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Edg/")) return "Edge";
  if (userAgent.includes("Chrome/")) return "Chrome";
  if (userAgent.includes("Firefox/")) return "Firefox";
  if (userAgent.includes("Safari/")) return "Safari";

  return "Unknown";
}

function getDeviceName() {
  return navigator.platform || "Unknown device";
}

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return error instanceof Error
    ? error.message
    : fallback;
}

export function useInitialNotificationPermission({
  onShowToast,
}: UseInitialNotificationPermissionOptions) {
  const userId = useAuthStore(
    (state) => state.user?.userId ?? null,
  );

  const [open, setOpen] = useState(() => {
    if (userId === null) {
      return false;
    }

    return hasInitialNotificationPermission(userId);
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    clearInitialNotificationPermission();
  }, [open]);

  const close = useCallback(() => {
    if (!isSubmitting) {
      setOpen(false);
    }
  }, [isSubmitting]);

  const allow = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { installationId, fcmToken } =
        await requestFcmRegistration();

      const [settings, subscription] =
        await Promise.all([
          getNotificationSettings(),
          registerPushSubscription({
            installationId,
            fcmToken,
            deviceName: getDeviceName(),
            browser: getBrowserName(),
          }),
        ]);

      window.localStorage.setItem(
        SUBSCRIPTION_ID_STORAGE_KEY,
        String(subscription.subscriptionId),
      );

      await updateNotificationSettings({
        ...settings,
        isServiceAlarmEnabled: true,
      });

      setOpen(false);
    } catch (error) {
      console.error(error);

      setOpen(false);

      onShowToast(
        getErrorMessage(
          error,
          "알림 설정을 변경하지 못했습니다.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onShowToast]);

  return {
    open,
    isSubmitting,
    allow,
    close,
  };
}