"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onCancelReply?: () => void;
}

export function CommentInput({
  onSubmit,
  placeholder = "댓글을 입력하세요...",
  disabled = false,
  onCancelReply,
}: CommentInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-20">
      {onCancelReply && (
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
          <span>{placeholder}</span>
          <button onClick={onCancelReply} className="text-gray-400 hover:text-gray-600">취소</button>
        </div>
      )}
      <div className="flex gap-3 items-center">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
          placeholder={onCancelReply ? "답글을 입력하세요..." : placeholder}
          disabled={disabled}
          className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className="p-2 text-primary-600 disabled:text-gray-300 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
