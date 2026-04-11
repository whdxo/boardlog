"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants";

interface PlayLogRow {
  id: string;
  played_at: string;
  player_count: number | null;
  rating: number | null;
}

interface GamePlayLogListProps {
  logs: PlayLogRow[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const day = dayNames[d.getDay()];
  return `${day}  ${d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}`;
}

export default function GamePlayLogList({ logs, total, page, onPageChange }: GamePlayLogListProps) {
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white">
      <h3 className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100">
        <span>📝</span> 플레이 로그
      </h3>

      {logs.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-400 text-center">
          아직 플레이 기록이 없어요.
        </p>
      ) : (
        <>
          <div className="divide-y divide-gray-50">
            {logs.map((log) => (
              <Link
                key={log.id}
                href={ROUTES.MY_LOG_DETAIL(log.id)}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-xs text-gray-400">{formatDate(log.played_at)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {log.rating != null && (
                      <span className="text-sm font-medium text-gray-700">
                        <span className="text-amber-400">★</span>
                        {(log.rating).toFixed(2)}/5
                      </span>
                    )}
                    {log.player_count != null && (
                      <span className="text-xs text-gray-500">{log.player_count}인플</span>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </Link>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange(i)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === i
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
