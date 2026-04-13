"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import type { PostCategory } from "@/types";

// ── 게시글 생성 ─────────────────────────────────────────────────
export function useCreatePost() {
  const router = useRouter();

  return useMutation({
    mutationFn: (body: { category: PostCategory; title: string; content: string }) =>
      fetchApi<{ id: string }>("/api/posts", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: (data) => {
      router.push(ROUTES.COMMUNITY_DETAIL(data.id));
    },
  });
}

// ── 게시글 삭제 ─────────────────────────────────────────────────
export function useDeletePost() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (postId: string) =>
      fetchApi<{ id: string }>(`/api/posts/${postId}`, { method: "DELETE" }),
    onSuccess: (_data, postId) => {
      queryClient.removeQueries({ queryKey: ["posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push(ROUTES.COMMUNITY);
    },
  });
}

// ── 좋아요 토글 ─────────────────────────────────────────────────
export function useToggleLike(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchApi<{ liked: boolean; likeCount: number }>(`/api/posts/${postId}/like`, {
        method: "POST",
      }),
    onSuccess: (data) => {
      // 단건 캐시 업데이트
      queryClient.setQueryData(["posts", postId], (old: Record<string, unknown> | undefined) => {
        if (!old) return old;
        return { ...old, isLiked: data.liked, likeCount: data.likeCount };
      });
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: false });
    },
  });
}

// ── 댓글 작성 ──────────────────────────────────────────────────
export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { content: string; parentId?: string }) =>
      fetchApi(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      // comment_count 반영을 위해 단건도 무효화
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    },
  });
}

// ── 댓글 삭제 ──────────────────────────────────────────────────
export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      fetchApi(`/api/comments/${commentId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    },
  });
}
