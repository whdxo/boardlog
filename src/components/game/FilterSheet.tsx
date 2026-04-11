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
import { PLAYER_OPTIONS, PRICE_OPTIONS, PLAY_TIME_OPTIONS, AGE_OPTIONS } from "@/constants";
import type { GameFilter } from "@/types";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filter: GameFilter;
  onApply: (filter: Partial<GameFilter>) => void;
}

const CHIP = "h-8 px-3.5 rounded-full text-caption font-medium border transition-colors";
const CHIP_DEFAULT = "border-gray-200 bg-white text-gray-700 hover:border-gray-300";
const CHIP_ACTIVE = "border-primary-500 bg-primary-50 text-primary-700";

export default function FilterSheet({
  open,
  onClose,
  filter,
  onApply,
}: FilterSheetProps) {
  const [players, setPlayers] = useState<string | undefined>(filter.players);
  const [priceRange, setPriceRange] = useState<string | undefined>(filter.priceRange);
  const [playTime, setPlayTime] = useState<string | undefined>(filter.playTime);
  const [minAge, setMinAge] = useState<string | undefined>(filter.minAge);

  const hasActive = !!(players || priceRange || playTime || minAge);

  function handleReset() {
    setPlayers(undefined);
    setPriceRange(undefined);
    setPlayTime(undefined);
    setMinAge(undefined);
  }

  function handleApply() {
    onApply({ players, priceRange, playTime, minAge });
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8 max-h-[85vh] overflow-y-auto">
        <SheetHeader className="flex-row items-center justify-between">
          <SheetTitle>상세 필터</SheetTitle>
          {hasActive && (
            <button
              type="button"
              onClick={handleReset}
              className="text-caption text-gray-400 hover:text-gray-600 transition-colors"
            >
              초기화
            </button>
          )}
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-5">
          {/* 인원수 */}
          <section>
            <p className="text-caption font-semibold text-gray-900 mb-2.5">인원수</p>
            <div className="flex flex-wrap gap-2">
              {PLAYER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(CHIP, players === opt.value ? CHIP_ACTIVE : CHIP_DEFAULT)}
                  onClick={() => setPlayers(players === opt.value ? undefined : opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* 가격대 */}
          <section>
            <p className="text-caption font-semibold text-gray-900 mb-2.5">가격대</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(CHIP, priceRange === opt.value ? CHIP_ACTIVE : CHIP_DEFAULT)}
                  onClick={() => setPriceRange(priceRange === opt.value ? undefined : opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* 플레이 시간 */}
          <section>
            <p className="text-caption font-semibold text-gray-900 mb-2.5">플레이 시간</p>
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

          {/* 권장 연령 */}
          <section>
            <p className="text-caption font-semibold text-gray-900 mb-2.5">권장 연령</p>
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

        <Button className="w-full mt-8" onClick={handleApply}>
          적용하기
        </Button>
      </SheetContent>
    </Sheet>
  );
}
