"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/common/StarRating";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  gameName: string;
  initialRating?: number;
  onSave: (score: number) => void;
  onDelete?: () => void;
}

function RatingContent({
  gameName,
  initialRating,
  onSave,
  onDelete,
  onClose,
}: Omit<RatingModalProps, "open">) {
  const [score, setScore] = useState(initialRating ?? 0);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="text-body text-gray-600">🎲 {gameName}</p>
      <StarRating value={score} onChange={setScore} size={40} />
      <p className="text-caption text-gray-400">
        {score ? `${score}점` : "별점을 선택하세요"}
      </p>
      <div className="flex flex-col gap-2 w-full">
        <Button
          className="w-full"
          disabled={!score}
          onClick={() => { onSave(score); onClose(); }}
        >
          저장하기
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            className="w-full text-error hover:text-error"
            onClick={() => { onDelete(); onClose(); }}
          >
            삭제하기
          </Button>
        )}
      </div>
    </div>
  );
}

export default function RatingModal(props: RatingModalProps) {
  const { open, onClose } = props;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>내 평점 등록</DialogTitle>
          </DialogHeader>
          <RatingContent {...props} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8">
        <SheetHeader>
          <SheetTitle>내 평점 등록</SheetTitle>
        </SheetHeader>
        <RatingContent {...props} />
      </SheetContent>
    </Sheet>
  );
}
