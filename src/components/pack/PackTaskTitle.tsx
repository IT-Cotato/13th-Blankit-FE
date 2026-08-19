interface PackTaskTitleProps {
  title: string;
}

export function PackTaskTitle({ title }: PackTaskTitleProps) {
  return (
    <div className="mt-2 flex h-6 w-[132px] items-center">
      <h2 className="w-full self-stretch truncate text-center font-sans text-[16px] font-semibold not-italic leading-[150%] tracking-[-0.24px] text-black-100">
        {title}
      </h2>
    </div>
  );
}
