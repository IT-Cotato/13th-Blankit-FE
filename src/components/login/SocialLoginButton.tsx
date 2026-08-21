import type { ReactNode } from "react";

interface SocialLoginButtonProps {
    icon: ReactNode;
    label: string;
    backgroundColor: string;
    textColor: string;
    onClick: () => void;
    disabled?: boolean;
}

export const SocialLoginButton = ({
    icon,
    label,
    backgroundColor,
    textColor,
    onClick,
    disabled = false,
}: SocialLoginButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex h-[42px] w-full items-center justify-center gap-2 self-stretch rounded-lg px-[30px] pb-[11px] pt-[10px] disabled:cursor-not-allowed"
            style={{ backgroundColor, color: textColor }}
        >
            {icon}
            <span className="whitespace-nowrap text-[14px] font-medium leading-[150%] tracking-[-0.21px]">
                {label}
            </span>
        </button>
    );
};
