"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value?: number;          // 현재 선택 값 (1~5)
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;           // 아이콘 크기 (px)
  className?: string;
}

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 24,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const display = !readOnly && hovered ? hovered : value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={cn(
            "transition-transform",
            !readOnly && "hover:scale-110 active:scale-95 cursor-pointer",
            readOnly && "cursor-default"
          )}
          aria-label={`${star}점`}
        >
          <Star
            size={size}
            className={cn(
              "transition-colors",
              star <= display
                ? "fill-accent-400 text-accent-400"
                : "fill-gray-100 text-gray-200"
            )}
          />
        </button>
      ))}
    </div>
  );
}
