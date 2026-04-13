"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import type { Comment } from "@/types";

export function useComments(postId: string | undefined) {
  return useQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => fetchApi<Comment[]>(`/api/posts/${postId}/comments`),
    enabled: !!postId,
    staleTime: 30 * 1000,
  });
}
