"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import type { Post } from "@/types";

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchApi<Post>(`/api/posts/${id}`),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}
