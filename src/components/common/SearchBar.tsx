"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  /** true면 input이 readOnly — 탭 시 onFocus 콜백만 실행 (홈에서 탐색 이동용) */
  readOnly?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "보드게임을 검색해보세요",
  className,
  onFocus,
  readOnly = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "relative flex items-center h-11 rounded-lg border border-gray-200 bg-gray-50 focus-within:border-primary-500 focus-within:bg-white transition-colors",
        className
      )}
    >
      <Search
        size={16}
        className="absolute left-3 text-gray-400 pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        readOnly={readOnly}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="w-full h-full pl-9 pr-9 bg-transparent text-body text-gray-900 placeholder:text-gray-400 outline-none"
      />
      {value && !readOnly && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600"
          aria-label="검색어 지우기"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
