import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  deletePushSubscription,
  getNotificationSettings,
  registerPushSubscription,
  updateNotificationSettings,
  type NotificationSettings,
} from '@/api/mypage/notifications';
import { Toast } from '@/components/common/Toast';
import { MyPageDetailTopBar } from '@/components/mypage/MyPageDetailTopBar';
import { NotificationSettingItem } from '@/components/mypage/NotificationSettingItem';
import { NotificationPermissionModal } from '@/components/notification/NotificationPermissionModal';
import { requestFcmRegistration } from '@/firebase/messaging';
import { useToast } from '@/hooks/useToast';

const SUBSCRIPTION_ID_STORAGE_KEY = 'blankit-push-subscription-id';

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

function getBrowserName() {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Edg/')) return 'Edge';
  if (userAgent.includes('Chrome/')) return 'Chrome';
  if (userAgent.includes('Firefox/')) return 'Firefox';
  if (userAgent.includes('Safari/')) return 'Safari';

  return 'Unknown';
}

function getDeviceName() {
  return navigator.platform || 'Unknown device';
}

export function NotificationSetting() {
  const navigate = useNavigate();
  const { message: toastMessage, showToast } = useToast(2000);
  const [settings, setSettings] = useState<NotificationSettings>({
    isServiceAlarmEnabled: false,
    is30minPackAlarmEnabled: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [pendingSettingKey, setPendingSettingKey] =
    useState<keyof NotificationSettings | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getNotificationSettings()
      .then(async (data) => {
        if (cancelled) return;

        setSettings(data);

        const hasEnabledSetting =
          data.isServiceAlarmEnabled || data.is30minPackAlarmEnabled;

        // PWA 재설치나 브라우저 데이터 초기화 후에는 FID와 FCM 토큰이
        // 달라질 수 있으므로, 이미 허용된 권한을 다시 묻지 않고 갱신한다.
        if (
          hasEnabledSetting &&
          Notification.permission === 'granted'
        ) {
          await ensurePushSubscription();
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(
            getErrorMessage(error, '알림 설정을 불러오지 못했습니다.'),
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function ensurePushSubscription() {
    const { installationId, fcmToken } = await requestFcmRegistration();

    if (import.meta.env.DEV) {
      console.log('[FCM test token]', fcmToken);
    }
    const subscription = await registerPushSubscription({
      installationId,
      fcmToken,
      deviceName: getDeviceName(),
      browser: getBrowserName(),
    });

    localStorage.setItem(
      SUBSCRIPTION_ID_STORAGE_KEY,
      String(subscription.subscriptionId),
    );
  }

  async function removePushSubscription() {
    const storedId = localStorage.getItem(SUBSCRIPTION_ID_STORAGE_KEY);

    if (!storedId) return;

    await deletePushSubscription(Number(storedId));
    localStorage.removeItem(SUBSCRIPTION_ID_STORAGE_KEY);
  }

  async function toggleSetting(key: keyof NotificationSettings) {
    const nextSettings = { ...settings, [key]: !settings[key] };

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (nextSettings[key]) {
        await ensurePushSubscription();
      }

      const savedSettings = await updateNotificationSettings(nextSettings);
      setSettings(savedSettings);

      if (
        !savedSettings.isServiceAlarmEnabled &&
        !savedSettings.is30minPackAlarmEnabled
      ) {
        await removePushSubscription();
      }

      showToast(
        nextSettings[key]
          ? '알림을 받습니다.'
          : '알림을 받지 않습니다.',
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, '알림 설정을 변경하지 못했습니다.'),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function requestToggle(key: keyof NotificationSettings) {
    if (isLoading) return;

    if (settings[key]) {
      await toggleSetting(key);
      return;
    }

    // Pack 알림은 설정 화면에서 직접 켜며 별도 안내 모달을 띄우지 않는다.
    if (key === 'is30minPackAlarmEnabled') {
      await toggleSetting(key);
      return;
    }

    setErrorMessage(null);
    setPendingSettingKey(key);
    setPermissionModalOpen(true);
  }

  async function allowPendingNotification() {
    if (pendingSettingKey === null || isLoading) return;

    try {
      await toggleSetting(pendingSettingKey);
    } finally {
      setPermissionModalOpen(false);
      setPendingSettingKey(null);
    }
  }

  function closePermissionModal() {
    if (isLoading) return;

    setPermissionModalOpen(false);
    setPendingSettingKey(null);
  }

  return (
    <div className="min-h-dvh bg-black-900 text-black-100">
      <MyPageDetailTopBar
        title="알림 설정"
        onBack={() => navigate('/mypage')}
        titleClassName="text-lg leading-[27px] tracking-[-0.27px]"
      />

      <main className="flex flex-col gap-5 px-[22px] pt-5">
        <NotificationSettingItem
          name="서비스 알림"
          description="과업 마감 전에 알림을 받아보세요"
          enabled={settings.isServiceAlarmEnabled}
          onToggle={() => {
            void requestToggle('isServiceAlarmEnabled');
          }}
        />
        <NotificationSettingItem
          name="30분 Pack! 알림"
          description="자투리 시간에 할 만한 과업을 추천해드려요"
          enabled={settings.is30minPackAlarmEnabled}
          onToggle={() => {
            void requestToggle('is30minPackAlarmEnabled');
          }}
        />

        {errorMessage && (
          <p role="alert" className="text-sm text-red-400">
            {errorMessage}
          </p>
        )}
      </main>

      <Toast message={toastMessage} aboveBottomNavigation />

      <NotificationPermissionModal
        open={permissionModalOpen}
        submitting={isLoading}
        title="Blankit 알림을 허용해주세요"
        description="선택한 알림을 받으려면 브라우저 또는 기기의 알림 권한이 필요해요."
        onAllow={() => {
          void allowPendingNotification();
        }}
        onClose={closePermissionModal}
      />
    </div>
  );
}
