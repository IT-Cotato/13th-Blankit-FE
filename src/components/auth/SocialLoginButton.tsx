import type { ReactNode } from "react";

interface SocialLoginButtonProps {
    icon: ReactNode;
    label: string;
    backgroundColor: string;
    textColor: string;
    onClick: () => void;
}

export const SocialLoginButton = ({
    icon,
    label,
    backgroundColor,
    textColor,
    onClick,
}: SocialLoginButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-[42px] w-full items-center justify-center gap-2 self-stretch rounded-lg px-[30px] pb-[11px] pt-[10px]"
            style={{ backgroundColor, color: textColor }}
        >
            {icon}
            <span className="text-[14px] font-medium leading-[150%] tracking-[-0.21px]">
                {label}
            </span>
        </button>
    );
};
