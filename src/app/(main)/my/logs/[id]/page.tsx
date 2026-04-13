"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Calendar, Star, Lock, Trash2 } from "lucide-react";
import MobileHeader from "@/components/layout/MobileHeader";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { usePlayLog, useDeletePlayLog } from "@/hooks/usePlayLog";
import { useAuthStore } from "@/stores/authStore";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}

interface LogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LogDetailPage({ params }: LogDetailPageProps) {
  const { id } = use(params);
  const { data: log, isLoading, error } = usePlayLog(id);
  const { user } = useAuthStore();
  const deletePlayLog = useDeletePlayLog();

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4 mt-14">
          <div className="h-16 bg-gray-100 rounded-xl" />
          <div className="h-24 bg-gray-100 rounded-xl" />
          <div className="h-20 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="max-w-lg mx-auto flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">기록을 찾을 수 없습니다</p>
      </div>
    );
  }

  const isOwner = user?.id === log.userId;

  return (
    <div className="max-w-lg mx-auto">
      <MobileHeader
        variant="back"
        title="기록 상세"
        rightSlot={
          isOwner ? (
            <Link href={ROUTES.MY_LOG_EDIT(id)} className="text-caption text-primary-500 font-medium">
              수정
            </Link>
          ) : undefined
        }
      />

      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* 헤더 — 데스크톱 */}
        <div className="hidden md:flex items-center justify-between">
          <h1 className="text-h1 font-bold text-gray-900">기록 상세</h1>
          {isOwner && (
            <div className="flex gap-2">
              <Link href={ROUTES.MY_LOG_EDIT(id)} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                수정하기
              </Link>
              <button
                onClick={() => deletePlayLog.mutate(id)}
                disabled={deletePlayLog.isPending}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-red-500 hover:text-red-600")}
              >
                <Trash2 size={14} />삭제
              </button>
            </div>
          )}
        </div>

        {/* 비공개 뱃지 */}
        {log.visibility === "private" && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} />
            <span>나만 보는 기록</span>
          </div>
        )}

        {/* 게임 정보 */}
        <Link href={ROUTES.GAME_DETAIL(log.gameId)} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {log.game?.thumbnail && (
              <Image src={log.game.thumbnail} alt={log.game.title} fill className="object-cover" />
            )}
          </div>
          <div>
            <p className="text-body font-semibold text-gray-900">{log.game?.title ?? "알 수 없는 게임"}</p>
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

        {/* 모바일 삭제 버튼 */}
        {isOwner && (
          <button
            onClick={() => deletePlayLog.mutate(id)}
            disabled={deletePlayLog.isPending}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-500 mt-2 md:hidden"
          >
            <Trash2 size={14} />기록 삭제
          </button>
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
