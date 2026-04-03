import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, FileText } from "lucide-react";
import { ROUTES } from "@/constants";
import type { PlayLog } from "@/types";

interface LogCardProps {
  log: PlayLog;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="text-caption text-accent-400 font-medium">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

export default function LogCard({ log }: LogCardProps) {
  return (
    <Link
      href={ROUTES.MY_LOG_DETAIL(log.id)}
      className="flex gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white"
    >
      {/* 썸네일 */}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
        {log.game.thumbnail && (
          <Image src={log.game.thumbnail} alt={log.game.title} fill className="object-cover" />
        )}
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <p className="text-body font-semibold text-gray-900 truncate">{log.game.title}</p>
        <p className="text-caption text-gray-400 mt-0.5">{formatDate(log.playedAt)}</p>

        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          {log.rating && <StarDisplay rating={log.rating} />}
          {log.players && log.players.length > 0 && (
            <span className="flex items-center gap-0.5 text-tiny text-gray-500">
              <Users size={11} />
              {log.players.length}명
            </span>
          )}
          {log.location && (
            <span className="flex items-center gap-0.5 text-tiny text-gray-500">
              <MapPin size={11} />
              {log.location}
            </span>
          )}
          {log.memo && (
            <span className="flex items-center gap-0.5 text-tiny text-gray-400">
              <FileText size={11} />
              메모
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
