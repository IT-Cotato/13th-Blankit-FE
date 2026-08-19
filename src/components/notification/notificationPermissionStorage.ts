const getInitialNotificationPermissionKey = (
  userId: number,
) =>
  `blankit_initial_notification_permission:${userId}`;

export function markInitialNotificationPermission(
  userId: number,
) {
  try {
    window.localStorage.setItem(
      getInitialNotificationPermissionKey(userId),
      "true",
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
        getInitialNotificationPermissionKey(userId),
      ) === "true"
    );
  } catch (error) {
    console.error(
      "최초 알림 권한 상태를 확인하지 못했습니다.",
      error,
    );

    return false;
  }
}

export function clearInitialNotificationPermission(
  userId: number,
) {
  try {
    window.localStorage.removeItem(
      getInitialNotificationPermissionKey(userId),
    );
  } catch (error) {
    console.error(
      "최초 알림 권한 상태를 삭제하지 못했습니다.",
      error,
    );
  }
}
