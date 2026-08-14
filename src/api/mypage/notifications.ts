import { apiClient } from '@/api/client';
import type { ApiEnvelope } from '@/types/auth';

export type NotificationSettings = {
  isServiceAlarmEnabled: boolean;
  is30minPackAlarmEnabled: boolean;
};

type PushSubscriptionRequest = {
  installationId: string;
  deviceName: string;
  browser: string;
};

type PushSubscriptionResponse = {
  subscriptionId: number;
  active: boolean;
};

export async function getNotificationSettings() {
  const response = await apiClient.get<ApiEnvelope<NotificationSettings>>(
    '/api/users/me/notification-settings',
  );

  return response.data.data;
}

export async function updateNotificationSettings(
  payload: NotificationSettings,
) {
  const response = await apiClient.patch<ApiEnvelope<NotificationSettings>>(
    '/api/users/me/notification-settings',
    payload,
  );

  return response.data.data;
}

export async function registerPushSubscription(
  payload: PushSubscriptionRequest,
) {
  const response = await apiClient.post<ApiEnvelope<PushSubscriptionResponse>>(
    '/api/v1/push-subscriptions',
    payload,
  );

  return response.data.data;
}

export async function deletePushSubscription(subscriptionId: number) {
  await apiClient.delete(`/api/v1/push-subscriptions/${subscriptionId}`);
}
