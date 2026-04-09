import type { GameStats } from "@/types";

interface ScoreStatsTableProps {
  scoreStats: GameStats["scoreStats"];
}

export default function ScoreStatsTable({ scoreStats }: ScoreStatsTableProps) {
  const { highest, lowest, average, mostWinner } = scoreStats;
  const hasData = highest != null || mostWinner != null;

  if (!hasData) return null;

  return (
    <div className="bg-white">
      <div className="grid grid-cols-4 text-center border-b border-gray-100">
        <div className="py-2 text-xs font-medium text-gray-500 bg-gray-50">최고 점수</div>
        <div className="py-2 text-xs font-medium text-gray-500 bg-gray-50">최저 점수</div>
        <div className="py-2 text-xs font-medium text-gray-500 bg-gray-50">평균 점수</div>
        <div className="py-2 text-xs font-medium text-gray-500 bg-gray-50">최다 승리</div>
      </div>
      <div className="grid grid-cols-4 text-center py-3">
        <div className="text-sm font-semibold text-gray-900">{highest ?? "-"}</div>
        <div className="text-sm font-semibold text-gray-900">{lowest ?? "-"}</div>
        <div className="text-sm font-semibold text-gray-900">{average ?? "-"}</div>
        <div>
          <div className="text-sm font-semibold text-gray-900">
            {mostWinner?.name ?? "-"}
          </div>
          {mostWinner && (
            <div className="text-xs text-gray-400">{mostWinner.wins}회</div>
          )}
        </div>
      </div>
    </div>
  );
}
