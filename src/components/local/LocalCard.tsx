import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { LocalPlace, LocalType } from "@/types";

const TYPE_LABEL: Record<LocalType, string> = {
  cafe:  "카페",
  store: "매장",
  club:  "클럽",
};

interface LocalCardProps {
  place: LocalPlace;
}

export function LocalCard({ place }: LocalCardProps) {
  return (
    <Link
      href={ROUTES.LOCAL_DETAIL(place.id)}
      className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {place.thumbnails?.[0] && (
          <Image src={place.thumbnails[0]} alt={place.name} fill className="object-cover" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-sm text-gray-900 truncate">{place.name}</h3>
          <span className="text-xs text-gray-400 flex-shrink-0">{TYPE_LABEL[place.type]}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs mb-1">
          <span className={cn("font-medium", place.isOpen ? "text-emerald-600" : "text-gray-400")}>
            {place.isOpen ? "영업중" : "영업종료"}
          </span>
          <span className="text-gray-300">·</span>
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="font-medium text-gray-700">{place.avgRating?.toFixed(1)}</span>
          <span className="text-gray-400">({place.reviewCount})</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{place.address}</span>
        </div>

        {place.gameCount && (
          <p className="text-xs text-gray-400 mt-1">🎲 {place.gameCount.toLocaleString()}+ 게임</p>
        )}
      </div>
    </Link>
  );
}
