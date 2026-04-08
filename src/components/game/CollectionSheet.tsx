"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { CollectionStatus } from "@/types";
import { COLLECTION_STATUSES } from "@/constants";

interface CollectionSheetProps {
  open: boolean;
  onClose: () => void;
  currentStatus?: CollectionStatus | null;
  onSelect: (status: CollectionStatus | null) => void;
  gameTitle?: string;
}

export function CollectionSheet({
  open,
  onClose,
  currentStatus,
  onSelect,
  gameTitle,
}: CollectionSheetProps) {
  const handleSelect = (status: CollectionStatus) => {
    // 같은 항목 다시 탭 → 제거
    onSelect(currentStatus === status ? null : status);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl px-0 max-h-[90dvh] overflow-y-auto">
        <SheetHeader className="px-5 pb-4 border-b border-gray-100">
          <SheetTitle className="text-left text-base">
            {gameTitle ? (
              <>
                <span className="text-primary-600">{gameTitle}</span>
                <span className="text-gray-900">를 컬렉션에 추가</span>
              </>
            ) : (
              "컬렉션 상태 선택"
            )}
          </SheetTitle>
          <p className="text-xs text-gray-400 mt-0.5">다시 탭하면 해제돼요</p>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-3 px-5 py-4">
          {COLLECTION_STATUSES.map((item) => {
            const isSelected = currentStatus === item.value;
            return (
              <button
                key={item.value}
                onClick={() => handleSelect(item.value)}
                className={cn(
                  "relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
                  isSelected
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                )}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
                <span className="text-2xl leading-none">{item.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400 truncate">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {currentStatus && (
          <div className="px-5 pb-6">
            <button
              onClick={() => { onSelect(null); onClose(); }}
              className="w-full py-3 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              컬렉션에서 제거
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CollectionSheet;
