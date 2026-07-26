type TopBarShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function TopBarShell({ children, className = "" }: TopBarShellProps) {
  return (
    <header
      className={`sticky top-0 z-50 bg-black-900 pt-[max(20px,env(safe-area-inset-top))] ${className}`}
    >
      <div className="flex h-[50px] w-full px-5">
        {children}
      </div>
    </header>
  );
}
