const INITIAL_NOTIFICATION_USER_ID_KEY =
  "blankit_initial_notification_user_id";

export function markInitialNotificationPermission(
  userId: number,
) {
  try {
    window.localStorage.setItem(
      INITIAL_NOTIFICATION_USER_ID_KEY,
      String(userId),
    );
  } catch (error) {
    console.error(
      "최초 알림 권한 상태를 저장하지 못했습니다.",
      error,
    );
  }
}

export function consumeInitialNotificationPermission(
  userId: number,
) {
  try {
    const pendingUserId =
      window.localStorage.getItem(
        INITIAL_NOTIFICATION_USER_ID_KEY,
      );

    if (pendingUserId !== String(userId)) {
      return false;
    }

    window.localStorage.removeItem(
      INITIAL_NOTIFICATION_USER_ID_KEY,
    );

    return true;
  } catch (error) {
    console.error(
      "최초 알림 권한 상태를 확인하지 못했습니다.",
      error,
    );

    return false;
  }
}