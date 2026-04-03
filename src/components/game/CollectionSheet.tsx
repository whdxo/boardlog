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
import type { CollectionStatus } from "@/types";

const OPTIONS: { value: CollectionStatus; label: string }[] = [
  { value: "owned", label: "보유중" },
  { value: "wishlist", label: "위시리스트" },
  { value: "completed", label: "플레이 완료" },
];

interface CollectionSheetProps {
  open: boolean;
  onClose: () => void;
  current?: CollectionStatus;
  onSave: (status: CollectionStatus) => void;
}

export default function CollectionSheet({
  open,
  onClose,
  current,
  onSave,
}: CollectionSheetProps) {
  const [selected, setSelected] = useState<CollectionStatus | undefined>(current);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8">
        <SheetHeader>
          <SheetTitle>컬렉션에 추가</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-2 mt-4">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelected(opt.value)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-colors text-left",
                selected === opt.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  selected === opt.value
                    ? "border-primary-500"
                    : "border-gray-300"
                )}
              >
                {selected === opt.value && (
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                )}
              </span>
              <span className="text-body font-medium">{opt.label}</span>
            </button>
          ))}
        </div>

        <Button
          className="w-full mt-6"
          disabled={!selected}
          onClick={() => { if (selected) { onSave(selected); onClose(); } }}
        >
          저장
        </Button>
      </SheetContent>
    </Sheet>
  );
}
