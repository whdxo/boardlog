import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants";

// 히트맵 목 데이터 (52주 × 7일)
function generateHeatmap() {
  const data: number[] = [];
  for (let i = 0; i < 52 * 7; i++) {
    data.push(Math.random() < 0.3 ? Math.ceil(Math.random() * 4) : 0);
  }
  return data;
}
const HEATMAP = generateHeatmap();

const TOP_GAMES = [
  { title: "카탄", count: 12 },
  { title: "팬데믹", count: 8 },
  { title: "스플렌더", count: 6 },
  { title: "윙스팬", count: 4 },
  { title: "글룸헤이븐", count: 3 },
];

const TOP_PLAYERS = [
  { name: "민준", count: 18 },
  { name: "서연", count: 14 },
  { name: "지수", count: 11 },
  { name: "현우", count: 7 },
  { name: "다은", count: 5 },
];

const INTENSITY_COLOR = ["bg-gray-100", "bg-primary-200", "bg-primary-300", "bg-primary-500", "bg-primary-700"];

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={ROUTES.MY} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">내 게임 통계</h1>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-6 flex flex-col gap-5">
        {/* 연간 요약 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">2025년 요약</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary-600">42</p>
              <p className="text-xs text-gray-500 mt-1">총 플레이</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">~86</p>
              <p className="text-xs text-gray-500 mt-1">시간</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">23</p>
              <p className="text-xs text-gray-500 mt-1">종류</p>
            </div>
          </div>
        </div>

        {/* 플레이 히트맵 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">플레이 활동</h2>
          <div
            className="grid gap-0.5 overflow-x-auto"
            style={{ gridTemplateColumns: "repeat(52, minmax(10px, 1fr))" }}
          >
            {Array.from({ length: 52 }).map((_, week) => (
              <div key={week} className="flex flex-col gap-0.5">
                {Array.from({ length: 7 }).map((_, day) => {
                  const val = HEATMAP[week * 7 + day];
                  return (
                    <div
                      key={day}
                      className={`w-2.5 h-2.5 rounded-sm ${INTENSITY_COLOR[val]}`}
                      title={val > 0 ? `${val}회` : ""}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 mt-3 justify-end">
            <span className="text-xs text-gray-400">적음</span>
            {INTENSITY_COLOR.map((c, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-sm ${c}`} />
            ))}
            <span className="text-xs text-gray-400">많음</span>
          </div>
        </div>

        {/* Top 5 게임 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">자주 한 게임 Top 5</h2>
          <div className="flex flex-col gap-3">
            {TOP_GAMES.map((g, i) => {
              const pct = Math.round((g.count / TOP_GAMES[0].count) * 100);
              return (
                <div key={g.title} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-4">{i + 1}</span>
                  <span className="text-sm font-medium text-gray-800 w-24 truncate">{g.title}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{g.count}회</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 같이 한 사람 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">자주 같이 한 사람 Top 5</h2>
          <div className="flex flex-col gap-3">
            {TOP_PLAYERS.map((p, i) => {
              const pct = Math.round((p.count / TOP_PLAYERS[0].count) * 100);
              return (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-4">{i + 1}</span>
                  <span className="text-sm font-medium text-gray-800 w-24">{p.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-accent-400 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{p.count}회</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
