import Link from "next/link";
import { Eye, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES, USED_TYPE_OPTIONS, ITEM_CONDITION_OPTIONS } from "@/constants";
import type { UsedPost } from "@/types";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

interface UsedPostCardProps {
  post: UsedPost;
}

export function UsedPostCard({ post }: UsedPostCardProps) {
  const typeOpt = USED_TYPE_OPTIONS.find((t) => t.value === post.type);
  const condOpt = ITEM_CONDITION_OPTIONS.find((c) => c.value === post.condition);
  const isDone = post.status === "done";

  return (
    <Link
      href={ROUTES.USED_DETAIL(post.id)}
      className={cn(
        "block px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors",
        isDone && "opacity-50"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {isDone ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">완료</span>
        ) : typeOpt && (
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", typeOpt.color)}>
            {typeOpt.label}
          </span>
        )}
        {post.gameTags?.map((g) => (
          <span key={g.id} className="text-xs text-gray-400">🎲 {g.title}</span>
        ))}
      </div>

      <h3 className={cn("font-semibold text-sm text-gray-900", isDone && "line-through text-gray-400")}>
        {post.title}
      </h3>

      <div className="flex items-center gap-2 mt-1">
        {post.price !== undefined && (
          <span className="text-sm font-bold text-primary-600">
            {post.price === 0 ? "나눔" : `${post.price.toLocaleString()}원`}
          </span>
        )}
        {condOpt && <span className="text-xs text-gray-400">· {condOpt.label}</span>}
      </div>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs text-gray-400">{post.user.nickname}</span>
        <span className="text-xs text-gray-300">·</span>
        <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Eye className="w-3.5 h-3.5" />{post.viewCount}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MessageCircle className="w-3.5 h-3.5" />{post.commentCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
