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
  token: string;
};

export async function requestFcmRegistration(): Promise<FcmRegistration> {
  if (!(await isSupported())) {
    throw new Error('이 브라우저는 Firebase 메시징을 지원하지 않습니다.');
  }

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('알림 권한이 허용되지 않았습니다.');
  }

  const serviceWorkerRegistration =
    (await navigator.serviceWorker.getRegistration('/')) ??
    (await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    }));
  const messaging = getMessaging(firebaseApp);

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration,
  });

  const installationId = await getId(getInstallations(firebaseApp));

  return { installationId, token };
}

export async function listenForForegroundMessages(
  onPayload: (payload: MessagePayload) => void,
): Promise<Unsubscribe> {
  if (!(await isSupported())) {
    return () => undefined;
  }

  return onMessage(getMessaging(firebaseApp), onPayload);
}
