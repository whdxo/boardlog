"use client";

import { ShoppingCart, Heart } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { COLLECTION_STATUS_LABEL } from "@/constants";
import type { CollectionStatus } from "@/types";

interface PurchaseSideCardProps {
  price: number;
  purchaseUrl?: string;
  collectionStatus?: CollectionStatus;
  onCollectionClick?: () => void;
  onRatingClick?: () => void;
  myRating?: number;
}

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}


export default function PurchaseSideCard({
  price,
  purchaseUrl,
  collectionStatus,
  onCollectionClick,
  onRatingClick,
  myRating,
}: PurchaseSideCardProps) {
  return (
    <div className="hidden md:block sticky top-24 w-72 shrink-0">
      <div className="rounded-2xl border border-gray-200 shadow-md p-6 flex flex-col gap-4">
        {/* 가격 */}
        <div>
          <p className="text-caption text-gray-400 mb-0.5">판매가</p>
          <p className="text-display font-bold text-primary-600">{formatPrice(price)}</p>
        </div>

        {/* 구매 버튼 */}
        {purchaseUrl && (
          <a
            href={purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), "w-full justify-center gap-2")}
          >
            <ShoppingCart size={16} />
            구매하러 가기
          </a>
        )}

        <hr className="border-gray-100" />

        {/* 컬렉션 */}
        <button
          type="button"
          className="flex items-center justify-between text-left"
          onClick={onCollectionClick}
        >
          <span className="text-caption font-medium text-gray-700">내 컬렉션</span>
          <span className="text-caption text-primary-600 font-semibold">
            {collectionStatus ? COLLECTION_STATUS_LABEL[collectionStatus] : "추가하기 +"}
          </span>
        </button>

        {/* 내 평점 */}
        <button
          type="button"
          className="flex items-center justify-between text-left"
          onClick={onRatingClick}
        >
          <span className="text-caption font-medium text-gray-700">내 평점</span>
          <span className="text-caption text-accent-400 font-semibold">
            {myRating ? `★ ${myRating}점` : "등록하기 +"}
          </span>
        </button>

        {/* 위시리스트 아이콘 (컬렉션 없을 때 fallback) */}
        {!collectionStatus && (
          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2")}
            onClick={onCollectionClick}
          >
            <Heart size={16} />
            위시리스트에 추가
          </button>
        )}
      </div>
    </div>
  );
}
