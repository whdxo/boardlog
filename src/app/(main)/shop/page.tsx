"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { cn } from "@/lib/utils";
import type { ShopProduct } from "@/types";

const MOCK_PRODUCTS: ShopProduct[] = [
  { id: "s1", title: "카르디아",      thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop", originalPrice: 24000, discountRate: 20, discountedPrice: 19200, category: "game",      stores: [{ storeName: "코보게", storeUrl: "#", price: 19200 }], isNew: false, isWishlisted: false, createdAt: "" },
  { id: "s2", title: "남남남",        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop", originalPrice: 31000, discountRate: 20, discountedPrice: 24900, category: "game",      stores: [{ storeName: "코보게", storeUrl: "#", price: 24900 }], isNew: true,  isWishlisted: true,  createdAt: "" },
  { id: "s3", title: "아르카나",      thumbnail: "https://images.unsplash.com/photo-1570979188870-5ed9bebe4dac?w=400&h=400&fit=crop", originalPrice: 42000,                  discountedPrice: 42000, category: "game",      stores: [{ storeName: "코리아보드게임즈", storeUrl: "#", price: 42000 }], isNew: false, isWishlisted: false, createdAt: "" },
  { id: "s4", title: "스플렌더 마블", thumbnail: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=400&h=400&fit=crop", originalPrice: 38000, discountRate: 15, discountedPrice: 32300, category: "game",      stores: [{ storeName: "코보게", storeUrl: "#", price: 32300 }], isNew: false, isWishlisted: false, createdAt: "" },
  { id: "s5", title: "카드 슬리브",   thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop", originalPrice: 8000,  discountRate: 10, discountedPrice: 7200,  category: "accessory", stores: [{ storeName: "코보게", storeUrl: "#", price: 7200 }], isNew: false, isWishlisted: false, createdAt: "" },
];

export default function ShopPage() {
  const [category, setCategory] = useState<"all" | "game" | "accessory">("all");
  const [wishlisted, setWishlisted] = useState<Set<string>>(
    new Set(MOCK_PRODUCTS.filter((p) => p.isWishlisted).map((p) => p.id))
  );

  const filtered = MOCK_PRODUCTS.filter((p) => category === "all" || p.category === category);

  const toggle = (id: string) => setWishlisted((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">쇼핑</h1>
          <button className="p-2 text-gray-500"><Search className="w-5 h-5" /></button>
        </div>
        <div className="px-4 pb-3 flex gap-2">
          {[["all", "전체"], ["game", "보드게임"], ["accessory", "악세서리"]].map(([val, label]) => (
            <button key={val} onClick={() => setCategory(val as "all" | "game" | "accessory")}
              className={cn("px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                category === val ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600")}
            >{label}</button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-3">
        <p className="text-sm text-gray-400">총 {filtered.length}개</p>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ShopProductCard
              key={product.id}
              product={product}
              wishlisted={wishlisted.has(product.id)}
              onWishlistToggle={toggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
