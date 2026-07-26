import addPlaylistIcon from "@/assets/icons/task-menu/add-playlist.svg";
import deleteIcon from "@/assets/icons/task-menu/delete.svg";
import editIcon from "@/assets/icons/task-menu/edit.svg";

interface TaskActionSheetProps {
  open: boolean;
  aboveBottomNavigation: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskActionSheet({
  open,
  aboveBottomNavigation,
  onClose,
  onEdit,
  onDelete,
}: TaskActionSheetProps) {
  if (!open) {
    return null;
  }

  const actions = [
    {
      label: "리스트 추가",
      icon: addPlaylistIcon,
    },
    {
      label: "수정",
      icon: editIcon,
      onClick: onEdit,
    },
    {
      label: "삭제",
      icon: deleteIcon,
      onClick: onDelete,
    },
  ];
  const bottomClassName = aboveBottomNavigation
    ? "bottom-[calc(90px+env(safe-area-inset-bottom))]"
    : "bottom-0";

  return (
    <>
      <button
        type="button"
        aria-label="과업 메뉴 닫기"
        onClick={onClose}
        className={`fixed inset-x-0 top-0 z-[51] cursor-default bg-transparent ${bottomClassName}`}
      />

      <section
        role="dialog"
        aria-modal="false"
        aria-label="과업 메뉴"
        className={`fixed inset-x-0 z-[52] h-[106px] bg-green-500 ${bottomClassName}`}
      >
        <div className="flex h-full">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="flex flex-1 flex-col items-center justify-center gap-2 text-[13px] font-medium text-black-900 active:bg-green-600"
            >
              <img
                src={action.icon}
                alt=""
                className="h-6 w-6"
              />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
