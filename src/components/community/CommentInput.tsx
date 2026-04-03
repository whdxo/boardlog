"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
}

export function CommentInput({ onSubmit, placeholder = "댓글을 입력하세요..." }: CommentInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3 items-center z-20">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
        placeholder={placeholder}
        className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-300"
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="p-2 text-primary-600 disabled:text-gray-300 transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
