import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import backIcon from "@/assets/icons/back-button-black-700.svg";
import clearIcon from "@/assets/icons/x.svg";
import { TopBarShell } from "@/components/layout/top-bar/TopBarShell";

type SearchBarProps = {
  onSearch: (keyword: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleClear = () => {
    setSearchText("");
    inputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedKeyword = searchText.trim();

    if (!trimmedKeyword) {
      return;
    }

    onSearch(trimmedKeyword);
  };

  return (
    <TopBarShell>
      <form
        onSubmit={handleSubmit}
        className="grid w-full grid-cols-[24px_minmax(0,1fr)_28px] items-center gap-x-3"
      >
        <button
          type="button"
          onClick={handleGoBack}
          aria-label="이전 페이지로 이동"
          className="flex h-6 w-6 items-center justify-center"
        >
          <img
            src={backIcon}
            alt=""
            className="h-3 w-[8px]"
          />
        </button>

        <div className="relative min-w-0">
          <input
            ref={inputRef}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="검색어 입력"
            className="
              h-[42px] w-full rounded-[6px]
              bg-black-850
              py-3 pl-4 pr-10
              text-[16px] font-medium leading-5
              text-black-100 outline-none
              placeholder:text-black-700
            "
          />

          {searchText.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="검색어 지우기"
              className="
                absolute right-4 top-1/2
                flex h-2.5 w-2.5
                -translate-y-1/2
                items-center justify-center
              "
            >
              <img
                src={clearIcon}
                alt=""
                className="h-3 w-3"
              />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleGoBack}
          className="
            w-7 shrink-0
            text-[14px] font-medium leading-5
            text-black-700
          "
        >
          취소
        </button>
      </form>
    </TopBarShell>
  );
}