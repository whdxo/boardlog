import type { PlayerCountRating } from "@/types";

interface PlayerCountRatingsProps {
  data: PlayerCountRating[];
}

export default function PlayerCountRatings({ data }: PlayerCountRatingsProps) {
  if (data.length === 0) return null;

  return (
    <div className="bg-white">
      <h3 className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100">
        <span>👥</span> 인원별 평점
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="text-left px-4 py-2 font-medium">인원</th>
              <th className="text-center px-2 py-2 font-medium">플레이수</th>
              <th className="text-center px-2 py-2 font-medium">내 평점</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row) => (
              <tr key={row.playerCount}>
                <td className="px-4 py-2.5 font-medium text-gray-900">{row.playerCount}인플</td>
                <td className="text-center px-2 py-2.5 text-gray-700">{row.playCount}</td>
                <td className="text-center px-2 py-2.5 text-gray-700">
                  {row.avgRating > 0 ? row.avgRating.toFixed(1) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
