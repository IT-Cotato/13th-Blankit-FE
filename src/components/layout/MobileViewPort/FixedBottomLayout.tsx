import type { ReactNode } from "react";

interface FixedBottomLayoutProps {
    children: ReactNode;
    zIndexClassName?: string;
    bottomClassName?: string;
    className?: string;
}

export const FixedBottomLayout = ({
    children,
    zIndexClassName = "z-50",
    bottomClassName = "bottom-0",
    className = "",
}: FixedBottomLayoutProps) => {
    return (
        <div
            className={`fixed inset-x-0 mx-auto sm:max-w-app ${bottomClassName} ${zIndexClassName} ${className}`}
        >
            {children}
        </div>
    );
};
