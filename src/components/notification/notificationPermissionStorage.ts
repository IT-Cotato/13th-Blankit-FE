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

export function hasInitialNotificationPermission(
  userId: number,
) {
  try {
    return (
      window.localStorage.getItem(
        INITIAL_NOTIFICATION_USER_ID_KEY,
      ) === String(userId)
    );
  } catch (error) {
    console.error(
      "최초 알림 권한 상태를 확인하지 못했습니다.",
      error,
    );

    return false;
  }
}

export function clearInitialNotificationPermission() {
  try {
    window.localStorage.removeItem(
      INITIAL_NOTIFICATION_USER_ID_KEY,
    );
  } catch (error) {
    console.error(
      "최초 알림 권한 상태를 삭제하지 못했습니다.",
      error,
    );
  }
}