import { useEffect, useState } from "react";

export const useElementRectValue = <T>(
    selector: string,
    extractValue: (rect: DOMRect) => T,
    fallback: T,
) => {
    const [value, setValue] = useState<T>(fallback);

    useEffect(() => {
        const element = document.querySelector<HTMLElement>(selector);
        if (!element) return;

        const updateValue = () => {
            setValue(extractValue(element.getBoundingClientRect()));
        };
        updateValue();

        const resizeObserver = new ResizeObserver(updateValue);
        resizeObserver.observe(element);
        window.addEventListener("resize", updateValue);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateValue);
        };
    }, [selector]);

    return value;
};
