interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-[190px] left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-[6px] border border-black-750 bg-black-800 px-4 py-3 text-[13px] font-medium text-black-200 shadow-lg"
    >
      {message}
    </div>
  );
}
