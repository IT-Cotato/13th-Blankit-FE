import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  deletePushSubscription,
  getNotificationSettings,
  registerPushSubscription,
  updateNotificationSettings,
  type NotificationSettings,
} from '@/api/mypage/notifications';
import { MyPageDetailTopBar } from '@/components/mypage/MyPageDetailTopBar';
import { NotificationSettingItem } from '@/components/mypage/NotificationSettingItem';
import { requestFcmRegistration } from '@/firebase/messaging';

const SUBSCRIPTION_ID_STORAGE_KEY = 'blankit-push-subscription-id';

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
  const [settings, setSettings] = useState<NotificationSettings>({
    isServiceAlarmEnabled: false,
    is30minPackAlarmEnabled: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getNotificationSettings()
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch(() => {
        if (!cancelled) setErrorMessage('알림 설정을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function ensurePushSubscription() {
    const { installationId, token } = await requestFcmRegistration();

    if (import.meta.env.DEV) {
      console.log('[FCM test token]', token);
    }
    const subscription = await registerPushSubscription({
      installationId,
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
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '알림 설정을 변경하지 못했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
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
            if (!isLoading) void toggleSetting('isServiceAlarmEnabled');
          }}
        />
        <NotificationSettingItem
          name="30분 Pack! 알림"
          description="자투리 시간에 할 만한 과업을 추천해드려요"
          enabled={settings.is30minPackAlarmEnabled}
          onToggle={() => {
            if (!isLoading) void toggleSetting('is30minPackAlarmEnabled');
          }}
        />

        {errorMessage && (
          <p role="alert" className="text-sm text-red-400">
            {errorMessage}
          </p>
        )}
      </main>
    </div>
  );
}
