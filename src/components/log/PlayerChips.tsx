"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PlayerChipsProps {
  players: string[];
  onChange: (players: string[]) => void;
}

export default function PlayerChips({ players, onChange }: PlayerChipsProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addPlayer() {
    const name = inputValue.trim();
    if (!name || players.includes(name)) return;
    onChange([...players, name]);
    setInputValue("");
  }

  function removePlayer(name: string) {
    onChange(players.filter((p) => p !== name));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addPlayer();
    } else if (e.key === "Backspace" && !inputValue && players.length > 0) {
      removePlayer(players[players.length - 1]);
    }
  }

  return (
    <div
      className="flex flex-wrap gap-1.5 min-h-[42px] px-3 py-2 rounded-lg border border-gray-200 focus-within:border-primary-500 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {players.map((name) => (
        <span
          key={name}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-caption font-medium"
        >
          {name}
          <button
            type="button"
            className="text-primary-400 hover:text-primary-700"
            onClick={(e) => { e.stopPropagation(); removePlayer(name); }}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addPlayer}
        placeholder={players.length === 0 ? "이름 입력 후 Enter" : ""}
        className="flex-1 min-w-[80px] outline-none text-body bg-transparent placeholder:text-gray-400"
      />
    </div>
  );
}
