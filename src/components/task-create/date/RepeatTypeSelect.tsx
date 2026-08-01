import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import selectIcon from "@/assets/icons/select-button-650.svg";

import type { RepeatPattern } from "./repeatTypes";

interface RepeatTypeSelectProps {
  value: RepeatPattern["type"];
  onChange: (value: RepeatPattern["type"]) => void;
}

const MENU_WIDTH = 100;
const MENU_HEIGHT = 105;
const MENU_OFFSET = 8;
const REPEAT_TYPES: Array<{
  value: RepeatPattern["type"];
  label: string;
}> = [
  { value: "weekly", label: "매주" },
  { value: "monthly", label: "매월" },
  { value: "yearly", label: "매년" },
];

export function RepeatTypeSelect({
  value,
  onChange,
}: RepeatTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = REPEAT_TYPES.findIndex(
    (option) => option.value === value,
  );
  const selectedLabel = REPEAT_TYPES[selectedIndex]?.label ?? "";

  function openMenu(initialIndex = selectedIndex) {
    if (!containerRef.current) {
      return;
    }

    const buttonRect = containerRef.current.getBoundingClientRect();
    setMenuPosition({
      top: buttonRect.top - MENU_HEIGHT - MENU_OFFSET,
      left: buttonRect.right - MENU_WIDTH,
    });
    setFocusedIndex(Math.max(initialIndex, 0));
    setOpen(true);
  }

  function selectOption(index: number) {
    const option = REPEAT_TYPES[index];

    if (!option) {
      return;
    }

    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeOnOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function closeOnViewportChange() {
      setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("resize", closeOnViewportChange);
    window.addEventListener("scroll", closeOnViewportChange, true);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("resize", closeOnViewportChange);
      window.removeEventListener("scroll", closeOnViewportChange, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, open]);

  return (
    <div ref={containerRef} className="relative h-8 w-[68px]">
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label="반복 유형"
            style={menuPosition}
            onKeyDown={(event) => {
              switch (event.key) {
                case "ArrowDown":
                  event.preventDefault();
                  setFocusedIndex(
                    (current) => (current + 1) % REPEAT_TYPES.length,
                  );
                  break;
                case "ArrowUp":
                  event.preventDefault();
                  setFocusedIndex(
                    (current) =>
                      (current - 1 + REPEAT_TYPES.length) %
                      REPEAT_TYPES.length,
                  );
                  break;
                case "Home":
                  event.preventDefault();
                  setFocusedIndex(0);
                  break;
                case "End":
                  event.preventDefault();
                  setFocusedIndex(REPEAT_TYPES.length - 1);
                  break;
                case "Enter":
                case " ":
                  event.preventDefault();
                  selectOption(focusedIndex);
                  break;
                case "Escape":
                  event.preventDefault();
                  setOpen(false);
                  triggerRef.current?.focus();
                  break;
              }
            }}
            className="fixed z-[100] h-[105px] w-[100px] overflow-hidden rounded-[6px] bg-black-750 shadow-[0_10px_60px_rgba(0,0,0,0.6)]"
          >
            {REPEAT_TYPES.map((option, index) => (
              <button
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                tabIndex={focusedIndex === index ? 0 : -1}
                onClick={() => selectOption(index)}
                className={`flex h-[35px] w-full items-center justify-center text-[14px] font-medium leading-[21px] tracking-[-0.015em] ${
                  option.value === value
                    ? "text-black-200"
                    : "text-black-650"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>,
          document.body,
        )}

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu(
              event.key === "ArrowUp"
                ? REPEAT_TYPES.length - 1
                : selectedIndex,
            );
          } else if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
          }
        }}
        className="flex h-8 w-full items-center justify-between rounded-[6px] bg-black-750 px-2 text-[14px] font-medium leading-[21px] tracking-[-0.015em] text-black-300"
      >
        <span>{selectedLabel}</span>
        <img
          src={selectIcon}
          alt=""
          className={`h-[7px] w-3 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}
