"use client";

import Link from "next/link";
import { ThumbsUp, MessageCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES, POST_CATEGORIES } from "@/constants";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export function PostCard({ post }: PostCardProps) {
  const cat = POST_CATEGORIES.find((c) => c.value === post.category);

  return (
    <Link
      href={ROUTES.COMMUNITY_DETAIL(post.id)}
      className="block bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors px-4 py-4"
    >
      <div className="flex items-center gap-2 mb-2">
        {cat && (
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", cat.color)}>
            {cat.label}
          </span>
        )}
        <span className="text-xs text-gray-400">{post.user?.nickname ?? "알 수 없음"}</span>
        <span className="text-xs text-gray-300">·</span>
        <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
      </div>

      <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug">
        {post.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{post.content}</p>

      <div className="flex items-center gap-4 mt-3">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <ThumbsUp className="w-3.5 h-3.5" />{post.likeCount}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <MessageCircle className="w-3.5 h-3.5" />{post.commentCount}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Eye className="w-3.5 h-3.5" />
          {post.viewCount >= 1000 ? `${(post.viewCount / 1000).toFixed(1)}k` : post.viewCount}
        </span>
      </div>
    </Link>
  );
}
