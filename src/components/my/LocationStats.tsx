import { MapPin } from "lucide-react";
import type { LocationStat } from "@/types";

interface LocationStatsProps {
  data: LocationStat[];
}

export default function LocationStats({ data }: LocationStatsProps) {
  return (
    <div className="bg-white">
      <h3 className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100">
        <span>📍</span> 장소 통계
      </h3>
      {data.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-400 text-center">
          장소별 통계가 없어요.
        </p>
      ) : (
        <div className="divide-y divide-gray-50">
          {data.map((loc) => (
            <div key={loc.location} className="flex items-center justify-between px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin size={14} className="text-gray-400" />
                {loc.location}
              </span>
              <span className="text-sm font-medium text-gray-900">{loc.playCount}회</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
