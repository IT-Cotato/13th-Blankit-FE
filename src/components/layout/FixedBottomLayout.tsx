import type { ReactNode } from "react";

interface FixedBottomLayoutProps {
    children: ReactNode;
    zIndexClassName?: string;
    className?: string;
}

export const FixedBottomLayout = ({
    children,
    zIndexClassName = "z-50",
    className = "",
}: FixedBottomLayoutProps) => {
    return (
        <div
            className={`fixed inset-x-0 bottom-0 mx-auto sm:max-w-app ${zIndexClassName} ${className}`}
        >
            {children}
        </div>
    );
};
