type TimeTableDeleteModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function TimeTableDeleteModal({
  onCancel,
  onConfirm,
}: TimeTableDeleteModalProps) {
  return (
    <MyPageConfirmModal
      labelledBy="timetable-delete-title"
      title="시간표를 삭제하시겠습니까?"
      cancelLabel="취소"
      confirmLabel="삭제"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
import { MyPageConfirmModal } from "@/components/mypage/MyPageConfirmModal";
