import addPlaylistIcon from "@/assets/icons/task-menu/add-playlist.svg";
import deleteIcon from "@/assets/icons/task-menu/delete.svg";
import editIcon from "@/assets/icons/task-menu/edit.svg";

interface TaskActionSheetProps {
  open: boolean;
  aboveBottomNavigation: boolean;
  addingToPlaylist: boolean;
  editingTaskReady: boolean;
  onClose: () => void;
  onAddToPlaylist: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskActionSheet({
  open,
  aboveBottomNavigation,
  addingToPlaylist,
  editingTaskReady,
  onClose,
  onAddToPlaylist,
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
      onClick: onAddToPlaylist,
      disabled: addingToPlaylist,
    },
    {
      label: "수정",
      icon: editIcon,
      onClick: onEdit,
      disabled: !editingTaskReady,
    },
    {
      label: "삭제",
      icon: deleteIcon,
      onClick: onDelete,
      disabled: false,
    },
  ];
  const bottomClassName = aboveBottomNavigation
    ? "bottom-[90px]"
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
        className={`fixed inset-x-0 z-[52] h-[90px] bg-green-500 px-6 ${bottomClassName}`}
      >
        <div className="flex h-full items-center gap-2.5">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              disabled={action.disabled}
              onClick={action.onClick}
              className="
                flex h-[67px] min-w-0 flex-1
                items-center justify-center
                rounded-[6px]
                p-2.5
                text-[12px] font-medium text-black-900
                active:bg-green-600
                disabled:opacity-50
              "
            >
              <div className="flex h-[47px] w-full flex-col items-center justify-center gap-[5px]">
                <img
                  src={action.icon}
                  alt=""
                  className="h-5 w-5"
                />
                <span>{action.label}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
