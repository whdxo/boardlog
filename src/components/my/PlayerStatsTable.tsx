import type { PlayerStatRow } from "@/types";

interface PlayerStatsTableProps {
  playerStats: PlayerStatRow[];
}

export default function PlayerStatsTable({ playerStats }: PlayerStatsTableProps) {
  if (playerStats.length === 0) return null;

  return (
    <div className="bg-white">
      <h3 className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100">
        <span>👤</span> 플레이어 통계
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="text-left px-4 py-2 font-medium">이름</th>
              <th className="text-center px-2 py-2 font-medium">승리</th>
              <th className="text-center px-2 py-2 font-medium">승률</th>
              <th className="text-center px-2 py-2 font-medium">평점</th>
              <th className="text-center px-2 py-2 font-medium">최고 점수</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {playerStats.map((p) => (
              <tr key={p.playerName}>
                <td className="px-4 py-2.5 font-medium text-gray-900">{p.playerName}</td>
                <td className="text-center px-2 py-2.5 text-gray-700">{p.wins}</td>
                <td className="text-center px-2 py-2.5 text-gray-700">{p.winRate}%</td>
                <td className="text-center px-2 py-2.5 text-gray-700">{p.avgScore || "-"}</td>
                <td className="text-center px-2 py-2.5 text-gray-700">{p.highScore || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
