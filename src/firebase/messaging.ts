import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Unsubscribe,
} from 'firebase/messaging';
import { getId, getInstallations } from 'firebase/installations';

import { firebaseApp } from './firebase';

export type FcmRegistration = {
  installationId: string;
  fcmToken: string;
};

export async function requestFcmRegistration(): Promise<FcmRegistration> {
  if (!(await isSupported())) {
    throw new Error('이 브라우저는 Firebase 메시징을 지원하지 않습니다.');
  }

  if (Notification.permission === 'denied') {
    throw new Error(
      '브라우저 또는 기기 설정에서 Blankit 알림 권한을 허용해주세요.',
    );
  }

  const permission = await Notification.requestPermission();

  if (permission === 'default') {
    throw new Error('알림 권한 요청을 취소했습니다. 다시 시도해주세요.');
  }

  if (permission === 'denied') {
    throw new Error(
      '브라우저 또는 기기 설정에서 Blankit 알림 권한을 허용해주세요.',
    );
  }

  const existingRegistration =
    await navigator.serviceWorker.getRegistration('/');

  if (!existingRegistration) {
    await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });
  }

  // register()는 서비스 워커가 설치·활성화되기 전에 반환될 수 있다.
  // PushManager.subscribe()에는 active 상태의 등록 객체가 필요하다.
  const serviceWorkerRegistration =
    await navigator.serviceWorker.ready;
  const messaging = getMessaging(firebaseApp);

  const fcmToken = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration,
  });

  if (!fcmToken) {
    throw new Error('FCM 토큰을 발급받지 못했습니다.');
  }

  const installationId = await getId(getInstallations(firebaseApp));

  return { installationId, fcmToken };
}

export async function listenForForegroundMessages(
  onPayload: (payload: MessagePayload) => void,
): Promise<Unsubscribe> {
  if (!(await isSupported())) {
    return () => undefined;
  }

  return onMessage(getMessaging(firebaseApp), onPayload);
}
