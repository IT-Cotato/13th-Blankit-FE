import { registerPushSubscription } from "@/api/mypage/notifications";
import { requestFcmRegistration } from "@/firebase/messaging";

export const PUSH_SUBSCRIPTION_ID_STORAGE_KEY =
  "blankit-push-subscription-id";

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

export async function ensurePushSubscription() {
  const { installationId, fcmToken } = await requestFcmRegistration();

  if (import.meta.env.DEV) {
    console.log("[FCM test token]", fcmToken);
  }

  const subscription = await registerPushSubscription({
    installationId,
    fcmToken,
    deviceName: getDeviceName(),
    browser: getBrowserName(),
  });

  localStorage.setItem(
    PUSH_SUBSCRIPTION_ID_STORAGE_KEY,
    String(subscription.subscriptionId),
  );

  return subscription;
}
