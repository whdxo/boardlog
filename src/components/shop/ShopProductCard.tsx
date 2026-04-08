"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { ShopProduct } from "@/types";

interface ShopProductCardProps {
  product: ShopProduct;
  wishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
}

export function ShopProductCard({ product, wishlisted = false, onWishlistToggle }: ShopProductCardProps) {
  return (
    <Link
      href={ROUTES.SHOP_DETAIL(product.id)}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountRate && product.discountRate > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {product.discountRate}%
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            NEW
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{product.title}</h3>
        <div className="mt-1">
          {product.discountRate && product.discountRate > 0 ? (
            <>
              <p className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</p>
              <p className="text-sm font-bold text-primary-600">{product.discountedPrice.toLocaleString()}원</p>
            </>
          ) : (
            <p className="text-sm font-bold text-gray-900">{product.discountedPrice.toLocaleString()}원</p>
          )}
        </div>
        {onWishlistToggle && (
          <button
            onClick={(e) => { e.preventDefault(); onWishlistToggle(product.id); }}
            className="mt-1 p-1 -ml-1 transition-colors"
          >
            <Heart className={cn("w-4 h-4", wishlisted ? "fill-red-500 text-red-500" : "text-gray-300")} />
          </button>
        )}
      </div>
    </Link>
  );
}
