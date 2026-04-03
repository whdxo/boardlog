"use client";

import { ShoppingCart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PurchaseBarProps {
  price: number;
  purchaseUrl?: string;
  onAddToWishlist?: () => void;
}

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

export default function PurchaseBar({ price, purchaseUrl, onAddToWishlist }: PurchaseBarProps) {
  return (
    <div className="fixed bottom-14 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3">
      <div className="flex-1">
        <p className="text-tiny text-gray-400">판매가</p>
        <p className="text-h1 font-bold text-primary-600">{formatPrice(price)}</p>
      </div>
      {onAddToWishlist && (
        <Button variant="outline" size="sm" onClick={onAddToWishlist} className="shrink-0">
          <ShoppingCart size={16} />
        </Button>
      )}
      {purchaseUrl && (
        <a
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants(), "shrink-0")}
        >
          구매하기
        </a>
      )}
    </div>
  );
}
