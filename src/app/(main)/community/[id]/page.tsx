"use client";

import { useState, use } from "react";
import { ArrowLeft, ThumbsUp, Share2, MoreHorizontal, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { CommentInput } from "@/components/community/CommentInput";
import { LoginPromptSheet } from "@/components/layout/LoginPromptSheet";
import { cn } from "@/lib/utils";
import { POST_CATEGORIES } from "@/constants";
import { useAuthStore } from "@/stores/authStore";
import { usePost } from "@/hooks/usePost";
import { useComments } from "@/hooks/useComments";
import { useToggleLike, useCreateComment, useDeleteComment, useDeletePost } from "@/hooks/usePostMutations";
import type { Comment } from "@/types";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

function CommentItem({
  comment,
  currentUserId,
  onReply,
  onDelete,
}: {
  comment: Comment;
  currentUserId?: string;
  onReply?: (parentId: string, nickname: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-sm font-bold text-gray-600">
          {comment.user.nickname[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-700">{comment.user.nickname}</span>
            <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
            {currentUserId === comment.userId && (
              <button
                onClick={() => onDelete(comment.id)}
                className="ml-auto text-gray-300 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700">{comment.content}</p>
          {onReply && (
            <button
              onClick={() => onReply(comment.id, comment.user.nickname)}
              className="text-xs text-gray-400 mt-1 hover:text-gray-600"
            >
              답글
            </button>
          )}
        </div>
      </div>

      {/* 대댓글 */}
      {comment.replies?.map((r) => (
        <div key={r.id} className="ml-11 mt-3 flex gap-3">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
            {r.user.nickname[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-700">{r.user.nickname}</span>
              <span className="text-xs text-gray-400">{timeAgo(r.createdAt)}</span>
              {currentUserId === r.userId && (
                <button
                  onClick={() => onDelete(r.id)}
                  className="ml-auto text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700">{r.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loginSheetOpen, setLoginSheetOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<{ parentId: string; nickname: string } | null>(null);
  const { isLoggedIn, user } = useAuthStore();
  const pathname = usePathname();

  const { data: post, isLoading: postLoading } = usePost(id);
  const { data: comments = [], isLoading: commentsLoading } = useComments(id);

  const toggleLike = useToggleLike(id);
  const createComment = useCreateComment(id);
  const deleteComment = useDeleteComment(id);
  const deletePost = useDeletePost();

  const cat = POST_CATEGORIES.find((c) => c.value === post?.category);

  const handleLike = () => {
    if (!isLoggedIn) { setLoginSheetOpen(true); return; }
    toggleLike.mutate();
  };

  const handleComment = (text: string) => {
    if (!isLoggedIn) { setLoginSheetOpen(true); return; }
    createComment.mutate(
      { content: text, parentId: replyTo?.parentId },
      { onSuccess: () => setReplyTo(null) }
    );
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment.mutate(commentId);
  };

  const handleReply = (parentId: string, nickname: string) => {
    if (!isLoggedIn) { setLoginSheetOpen(true); return; }
    setReplyTo({ parentId, nickname });
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-white px-4 pt-14">
        <div className="animate-pulse space-y-4 mt-4">
          <div className="h-6 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-40 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">게시글을 찾을 수 없습니다</p>
      </div>
    );
  }

  const totalComments = comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center gap-3 px-4 h-14">
        <button onClick={() => history.back()} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1" />
        {user?.id === post.userId && (
          <button
            onClick={() => deletePost.mutate(id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        <button className="p-1"><MoreHorizontal className="w-5 h-5 text-gray-500" /></button>
      </div>

      <article className="px-4 pt-4 pb-32">
        {cat && (
          <span className={cn("inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3", cat.color)}>
            {cat.label}
          </span>
        )}
        <h1 className="text-xl font-bold text-gray-900 leading-snug mb-4">{post.title}</h1>
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
            {post.user?.nickname[0] ?? "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{post.user?.nickname ?? "알 수 없음"}</p>
            <p className="text-xs text-gray-400">{timeAgo(post.createdAt)} · 조회 {post.viewCount}</p>
          </div>
        </div>

        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
          {post.content}
        </div>

        {/* 액션 */}
        <div className="flex items-center gap-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLike}
            disabled={toggleLike.isPending}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors",
              post.isLiked
                ? "border-primary-500 bg-primary-50 text-primary-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            <ThumbsUp className="w-4 h-4" />
            추천 {post.likeCount}
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            <Share2 className="w-4 h-4" />공유
          </button>
        </div>

        {/* 댓글 */}
        <div className="mt-4">
          <h2 className="font-semibold text-gray-900 mb-4">댓글 {totalComments}개</h2>
          {commentsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-50 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  currentUserId={user?.id}
                  onReply={handleReply}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}
        </div>
      </article>

      <CommentInput
        placeholder={replyTo ? `@${replyTo.nickname}에게 답글...` : "댓글을 입력하세요..."}
        onSubmit={handleComment}
        disabled={createComment.isPending}
        onCancelReply={replyTo ? () => setReplyTo(null) : undefined}
      />
      <LoginPromptSheet open={loginSheetOpen} onClose={() => setLoginSheetOpen(false)} callbackUrl={pathname} />
    </div>
  );
}
