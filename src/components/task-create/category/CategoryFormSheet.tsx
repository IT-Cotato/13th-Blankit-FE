import { useEffect, useRef, useState } from "react";

import checkWhiteIcon from "@/assets/icons/check_white.svg";
import backIcon from "@/assets/icons/header/back-black-700.svg";

import { CATEGORY_ICON_OPTIONS } from "@/constants/category";
import { CategoryIconBadge } from "./CategoryIconBadge";

import { useVisualViewport } from "@/hooks/useVisualViewport";

import type {
  CategoryIconKey,
  CategoryMutationRequest,
} from "@/types/category";

const ICON_PALETTE_COLOR = "var(--color-black-600)";

interface CategoryFormSheetProps {
  mode: "create" | "update";
  initialName?: string;
  initialColor?: string;
  initialIconKey?: CategoryIconKey;
  colors: string[];
  submitting?: boolean;
  onBack: () => void;
  onSubmit: (values: CategoryMutationRequest) => void;
}

export function CategoryFormSheet({
  mode,
  initialName = "",
  initialColor,
  initialIconKey = "ctgy-1",
  colors,
  submitting = false,
  onBack,
  onSubmit,
}: CategoryFormSheetProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { height: viewportHeight, keyboardInset } = useVisualViewport();
  const palette = colors;

  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor ?? palette[0] ?? "");
  const [selectedIconKey, setSelectedIconKey] =
    useState<CategoryIconKey>(initialIconKey);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const canSubmit = name.trim().length > 0 && Boolean(color);

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label={mode === "create" ? "카테고리 추가" : "카테고리 수정"}
      className="fixed inset-x-0 z-[70] overflow-y-auto overscroll-contain rounded-t-[24px] bg-black-850 px-5 pb-6 pt-5"
      style={{
        bottom: keyboardInset,
        maxHeight: Math.max(0, viewportHeight - 12),
      }}
    >
      <header className="flex items-center gap-3">
        <button
          type="button"
          aria-label="카테고리 목록으로 돌아가기"
          onClick={onBack}
          className="flex h-6 w-6 items-center justify-start"
        >
          <img
            src={backIcon}
            alt=""
            className="h-3 w-2"
          />

        </button>

        <input
          ref={inputRef}
          value={name}
          maxLength={30}
          aria-label="카테고리명"
          placeholder="카테고리명 입력"
          onChange={(event) => setName(event.target.value)}
          className="h-11 min-w-0 flex-1 rounded-[8px] bg-black-800 px-4 text-[16px] text-black-100 outline-none placeholder:text-black-500"
        />

        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={() =>
            onSubmit({
              name: name.trim(),
              color,
              iconKey: selectedIconKey,
            })
          }
          className="h-9 shrink-0 rounded-[6px] bg-green-500 px-3 text-[13px] font-semibold text-black-900 disabled:opacity-40"
        >
          {submitting ? "저장 중" : "완료"}
        </button>
      </header>

      <fieldset className="mt-5 min-w-0 max-w-full">
        <legend className="text-[13px] font-semibold text-black-100">
          색상
        </legend>

        <div className="mt-3 flex w-full max-w-full gap-4 overflow-x-auto overflow-y-hidden pb-2 overscroll-x-contain touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {palette.map((colorOption) => {
            const isSelected = color === colorOption;

            return (
              <button
                key={colorOption}
                type="button"
                aria-label={`${colorOption} 색상`}
                aria-pressed={isSelected}
                onClick={() => setColor(colorOption)}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected
                    ? "border-black-100"
                    : "border-black-700"
                }`}
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full"
                  style={{ backgroundColor: colorOption }}
                >
                  {isSelected && (
                    <img
                      src={checkWhiteIcon}
                      alt=""
                      className="h-3 w-[13px]"
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-5 min-w-0 max-w-full">
        <legend
          className="
            text-[13px] font-semibold
            text-black-100
          "
        >
          아이콘
        </legend>

        <div
          className="
            mt-3 flex w-full max-w-full
            gap-4 overflow-x-auto
            overflow-y-hidden pb-2
            overscroll-x-contain
            touch-pan-x
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {CATEGORY_ICON_OPTIONS.map(
            ({ key, icon }) => {
              const isSelected =
                selectedIconKey === key;

              return (
                <button
                  key={key}
                  type="button"
                  aria-label={`${key} 아이콘`}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedIconKey(key);
                  }}
                  className={`
                    relative flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-full border-2
                    ${
                      isSelected
                        ? "border-black-100"
                        : "border-black-700"
                    }
                  `}
                >
                  <CategoryIconBadge
                    icon={icon}
                    color={ICON_PALETTE_COLOR}
                    size={28}
                  />

                  {isSelected && (
                    <img
                      src={checkWhiteIcon}
                      alt=""
                      className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-3 w-[13px] -translate-x-1/2 -translate-y-1/2"
                    />
                  )}
                </button>
              );
            },
          )}
        </div>
      </fieldset>
    </section>
  );
}
