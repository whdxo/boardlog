"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GENRE_OPTIONS, PLAY_TIME_OPTIONS, AGE_OPTIONS } from "@/constants";
import type { GameFilter } from "@/types";
// FilterSheet uses individual state slices instead of a single local GameFilter object

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filter: GameFilter;
  onApply: (filter: Partial<GameFilter>) => void;
}

const CHIP = "h-8 px-3.5 rounded-full text-caption font-medium border transition-colors";
const CHIP_DEFAULT = "border-gray-200 text-gray-700 hover:border-gray-300";
const CHIP_ACTIVE = "border-primary-500 bg-primary-50 text-primary-700";

export default function FilterSheet({
  open,
  onClose,
  filter,
  onApply,
}: FilterSheetProps) {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    filter.genres?.[0]
  );
  const [playTime, setPlayTime] = useState<string | undefined>(filter.playTime);
  const [minAge, setMinAge] = useState<string | undefined>(filter.minAge);

  function handleReset() {
    setSelectedGenre(undefined);
    setPlayTime(undefined);
    setMinAge(undefined);
  }

  function handleApply() {
    onApply({
      genres: selectedGenre ? [selectedGenre] : undefined,
      playTime,
      minAge,
    });
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8 max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>필터</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-4">
          {/* 장르 */}
          <section>
            <p className="text-caption font-semibold text-gray-500 mb-2">장르</p>
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={cn(CHIP, selectedGenre === g ? CHIP_ACTIVE : CHIP_DEFAULT)}
                  onClick={() => setSelectedGenre(selectedGenre === g ? undefined : g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </section>

          {/* 플레이 시간 */}
          <section>
            <p className="text-caption font-semibold text-gray-500 mb-2">플레이 시간</p>
            <div className="flex flex-wrap gap-2">
              {PLAY_TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(CHIP, playTime === opt.value ? CHIP_ACTIVE : CHIP_DEFAULT)}
                  onClick={() => setPlayTime(playTime === opt.value ? undefined : opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* 연령 */}
          <section>
            <p className="text-caption font-semibold text-gray-500 mb-2">권장 연령</p>
            <div className="flex flex-wrap gap-2">
              {AGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(CHIP, minAge === opt.value ? CHIP_ACTIVE : CHIP_DEFAULT)}
                  onClick={() => setMinAge(minAge === opt.value ? undefined : opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            초기화
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            적용하기
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
