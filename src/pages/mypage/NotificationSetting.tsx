import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MyPageDetailTopBar } from "@/components/mypage/MyPageDetailTopBar";
import { NotificationSettingItem } from "@/components/mypage/NotificationSettingItem";

export function NotificationSetting() {
  const navigate = useNavigate();
  const [serviceNotificationEnabled, setServiceNotificationEnabled] =
    useState(false);
  const [packNotificationEnabled, setPackNotificationEnabled] = useState(false);

  return (
    <div className="min-h-dvh bg-black-900 text-black-100">
      <MyPageDetailTopBar
        title="알림 설정"
        onBack={() => navigate(-1)}
        titleClassName="text-lg leading-[27px] tracking-[-0.27px]"
      />

      <main className="flex flex-col gap-5 px-[22px] pt-5">
        <NotificationSettingItem
          name="서비스 알림"
          description="과업 마감 전에 알림을 받아보세요"
          enabled={serviceNotificationEnabled}
          onToggle={() => setServiceNotificationEnabled((enabled) => !enabled)}
        />
        <NotificationSettingItem
          name="30분 Pack! 알림"
          description="자투리 시간에 할 만한 과업을 추천해 드려요"
          enabled={packNotificationEnabled}
          onToggle={() => setPackNotificationEnabled((enabled) => !enabled)}
        />
      </main>
    </div>
  );
}
