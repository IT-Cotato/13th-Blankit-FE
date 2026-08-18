import { MyPageConfirmModal } from "@/components/mypage/MyPageConfirmModal";

type TimeTableOverlapModalProps = {
  onConfirm: () => void;
  title?: string;
};

export function TimeTableOverlapModal({
  onConfirm,
  title = "겹치는 시간에는 수업을 추가할 수 없습니다",
}: TimeTableOverlapModalProps) {
  return (
    <MyPageConfirmModal
      labelledBy="timetable-overlap-title"
      title={title}
      confirmLabel="확인"
      onConfirm={onConfirm}
    />
  );
}
