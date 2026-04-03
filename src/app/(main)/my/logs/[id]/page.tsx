import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Calendar, Star } from "lucide-react";
import MobileHeader from "@/components/layout/MobileHeader";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { PlayLog } from "@/types";

// Mock data
const MOCK_LOGS: Record<string, PlayLog> = {
  "1": {
    id: "1",
    userId: "u1",
    gameId: "1",
    game: { id: "1", title: "카탄", minPlayers: 3, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400" },
    playedAt: "2024-03-15",
    players: ["지수", "민준", "서연"],
    location: "보드게임 카페",
    rating: 4,
    memo: "정말 재밌었다! 다음에 또 하고 싶다. 카탄은 역시 협상 게임의 명작이다.",
    createdAt: "2024-03-15T12:00:00Z",
    updatedAt: "2024-03-15T12:00:00Z",
  },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}

interface LogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LogDetailPage({ params }: LogDetailPageProps) {
  const { id } = await params;
  const log = MOCK_LOGS[id];

  if (!log) notFound();

  return (
    <div className="max-w-lg mx-auto">
      <MobileHeader variant="back" title="기록 상세" rightSlot={
        <Link href={ROUTES.MY_LOG_EDIT(id)} className="text-caption text-primary-500 font-medium">
          수정
        </Link>
      } />

      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* 헤더 — 데스크톱 */}
        <div className="hidden md:flex items-center justify-between">
          <h1 className="text-h1 font-bold text-gray-900">기록 상세</h1>
          <Link href={ROUTES.MY_LOG_EDIT(id)} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            수정하기
          </Link>
        </div>

        {/* 게임 정보 */}
        <Link href={ROUTES.GAME_DETAIL(log.gameId)} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {log.game.thumbnail && (
              <Image src={log.game.thumbnail} alt={log.game.title} fill className="object-cover" />
            )}
          </div>
          <div>
            <p className="text-body font-semibold text-gray-900">{log.game.title}</p>
            <p className="text-caption text-primary-500">게임 정보 보기 →</p>
          </div>
        </Link>

        {/* 플레이 정보 */}
        <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl">
          <InfoRow icon={<Calendar size={15} className="text-gray-400" />} label="플레이 날짜" value={formatDate(log.playedAt)} />
          {log.players && log.players.length > 0 && (
            <InfoRow icon={<Users size={15} className="text-gray-400" />} label="함께한 사람" value={log.players.join(", ")} />
          )}
          {log.location && (
            <InfoRow icon={<MapPin size={15} className="text-gray-400" />} label="장소" value={log.location} />
          )}
          {log.rating && (
            <InfoRow icon={<Star size={15} className="text-accent-400" />} label="내 평점" value={`${log.rating}점`} />
          )}
        </div>

        {/* 메모 */}
        {log.memo && (
          <section>
            <p className="text-caption font-semibold text-gray-700 mb-2">메모</p>
            <p className="text-body text-gray-700 leading-relaxed whitespace-pre-line">
              {log.memo}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="text-caption text-gray-500 w-24 shrink-0">{label}</span>
      <span className="text-caption text-gray-900 font-medium">{value}</span>
    </div>
  );
}
