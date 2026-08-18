import type { ReactNode } from "react";

import { FixedBottomLayout } from "@/components/layout/FixedBottomLayout";

interface BottomSheetContainerProps {
    visible: boolean;
    ariaLabel: string;
    children: ReactNode;
    className?: string;
}

export const BottomSheetContainer = ({
    visible,
    ariaLabel,
    children,
    className = "",
}: BottomSheetContainerProps) => {
    return (
        <FixedBottomLayout zIndexClassName="z-[70]">
            <section
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                aria-hidden={!visible}
                className={`min-h-[150px] rounded-t-[24px] bg-black-850 px-5 pb-5 pt-6 transition-opacity ${
                    visible ? "opacity-100" : "pointer-events-none opacity-0"
                } ${className}`}
            >
                {children}
            </section>
        </FixedBottomLayout>
    );
};
