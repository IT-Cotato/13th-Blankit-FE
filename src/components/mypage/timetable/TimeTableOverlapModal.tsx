type TimeTableOverlapModalProps = {
  onConfirm: () => void;
};

export function TimeTableOverlapModal({
  onConfirm,
}: TimeTableOverlapModalProps) {
  return (
    <MyPageConfirmModal
      labelledBy="timetable-overlap-title"
      title="겹치는 시간에는 수업을 추가할 수 없습니다"
      confirmLabel="확인"
      onConfirm={onConfirm}
    />
  );
}
import { MyPageConfirmModal } from "@/components/mypage/MyPageConfirmModal";
