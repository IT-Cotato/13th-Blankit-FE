interface PackTaskProgressDetailProps {
  detail: string;
}

export function PackTaskProgressDetail({
  detail,
}: PackTaskProgressDetailProps) {
  return (
    <div className="flex h-[18px] w-full items-center">
      <p className="w-full self-stretch truncate text-center font-sans text-[12px] font-medium not-italic leading-[150%] tracking-[-0.18px] text-black-650">
        {detail}
      </p>
    </div>
  );
}
