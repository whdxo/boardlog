"use client";

import { useState } from "react";
import { LocalCard } from "@/components/local/LocalCard";
import { cn } from "@/lib/utils";
import type { LocalPlace, LocalType } from "@/types";

const MOCK_PLACES: LocalPlace[] = [
  { id: "p1", name: "플레이보드",          type: "cafe",  address: "서울 마포구 어울마당로 130", lat: 37.557, lng: 126.924, thumbnails: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"], avgRating: 4.2, reviewCount: 23, gameCount: 500, isOpen: true,  createdAt: "" },
  { id: "p2", name: "보드게임카페 홍대점", type: "cafe",  address: "서울 마포구 와우산로 100",   lat: 37.556, lng: 126.921, thumbnails: ["https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=300&fit=crop"], avgRating: 4.0, reviewCount: 11, gameCount: 350, isOpen: true,  createdAt: "" },
  { id: "p3", name: "삼구오구 보드카페",   type: "cafe",  address: "서울 송파구 올림픽로 44",   lat: 37.514, lng: 127.102, thumbnails: ["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop"], avgRating: 4.5, reviewCount: 38, gameCount: 800, isOpen: false, createdAt: "" },
  { id: "p4", name: "코리아보드게임즈",    type: "store", address: "서울 강남구 테헤란로 231",  lat: 37.504, lng: 127.048, thumbnails: ["https://images.unsplash.com/photo-1570979188870-5ed9bebe4dac?w=400&h=300&fit=crop"], avgRating: 4.3, reviewCount: 15, gameCount: 1200, isOpen: true, createdAt: "" },
];

const TYPE_FILTERS: { label: string; value: LocalType | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "카페",  value: "cafe" },
  { label: "매장",  value: "store" },
  { label: "클럽",  value: "club" },
];

export default function LocalPage() {
  const [typeFilter, setTypeFilter] = useState<LocalType | "all">("all");
  const filtered = MOCK_PLACES.filter((p) => typeFilter === "all" || p.type === typeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center">
          <h1 className="text-lg font-bold text-gray-900">로컬</h1>
        </div>
        <div className="px-4 pb-3 flex gap-2">
          {TYPE_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                typeFilter === value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"
              )}
            >{label}</button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-4 flex flex-col gap-4">
        {filtered.map((place) => (
          <LocalCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
}
