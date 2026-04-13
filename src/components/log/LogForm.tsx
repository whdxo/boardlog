"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StarRating from "@/components/common/StarRating";
import PlayerChips from "./PlayerChips";
import GameSearchSheet from "./GameSearchSheet";
import type { Game, PlayLogFormData } from "@/types";

interface LogFormProps {
  initialData?: Partial<PlayLogFormData>;
  initialGame?: Game;
  onSubmit: (data: PlayLogFormData) => void;
  submitLabel?: string;
  loading?: boolean;
}

export default function LogForm({
  initialData,
  initialGame,
  onSubmit,
  submitLabel = "저장하기",
  loading,
}: LogFormProps) {
  const [game, setGame] = useState<Game | undefined>(initialGame);
  const [gameSheetOpen, setGameSheetOpen] = useState(false);
  const [playedAt, setPlayedAt] = useState(
    initialData?.playedAt ?? new Date().toISOString().split("T")[0]
  );
  const [players, setPlayers] = useState<string[]>(initialData?.players ?? []);
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [rating, setRating] = useState(initialData?.rating ?? 0);
  const [memo, setMemo] = useState(initialData?.memo ?? "");
  const [visibility, setVisibility] = useState<"public" | "private">(
    initialData?.visibility ?? "public"
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!game) return;
    onSubmit({
      gameId: game.id,
      playedAt,
      players,
      location,
      rating: rating || undefined,
      memo,
      visibility,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* 게임 선택 */}
      <Field label="게임">
        <button
          type="button"
          className="flex items-center justify-between w-full h-11 px-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-left"
          onClick={() => setGameSheetOpen(true)}
        >
          <span className={game ? "text-body text-gray-900" : "text-body text-gray-400"}>
            {game ? game.title : "게임을 선택하세요"}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
        <GameSearchSheet
          open={gameSheetOpen}
          onClose={() => setGameSheetOpen(false)}
          onSelect={setGame}
        />
      </Field>

      {/* 플레이 날짜 */}
      <Field label="플레이 날짜">
        <Input
          type="date"
          value={playedAt}
          onChange={(e) => setPlayedAt(e.target.value)}
          className="h-11"
          required
        />
      </Field>

      {/* 함께한 사람 */}
      <Field label="함께한 사람" hint="선택">
        <PlayerChips players={players} onChange={setPlayers} />
      </Field>

      {/* 장소 */}
      <Field label="장소" hint="선택">
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="예: 집, 보드게임 카페"
          className="h-11"
        />
      </Field>

      {/* 별점 */}
      <Field label="내 평점" hint="선택">
        <div className="flex items-center gap-3">
          <StarRating value={rating} onChange={setRating} size={32} />
          {rating > 0 && (
            <span className="text-caption text-gray-500">{rating}점</span>
          )}
        </div>
      </Field>

      {/* 메모 */}
      <Field label="메모" hint="선택">
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="게임 후기, 느낀 점을 자유롭게 작성해보세요"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-body resize-none placeholder:text-gray-400"
        />
      </Field>

      {/* 공개 범위 */}
      <Field label="공개 범위">
        <div className="flex gap-2">
          {([
            { value: "public", label: "전체 공개" },
            { value: "private", label: "나만 보기" },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setVisibility(opt.value)}
              className={
                visibility === opt.value
                  ? "flex-1 py-2 rounded-xl border-2 border-primary-500 text-primary-600 text-caption font-semibold transition-colors"
                  : "flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 text-caption transition-colors hover:border-gray-300"
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      <Button type="submit" className="w-full" disabled={!game || loading}>
        {loading ? "저장 중..." : submitLabel}
      </Button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-caption font-semibold text-gray-700">{label}</label>
        {hint && <span className="text-tiny text-gray-400">({hint})</span>}
      </div>
      {children}
    </div>
  );
}
