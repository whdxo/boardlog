"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import type { Post, PostCategory } from "@/types";

interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
}

interface UsePostsOptions {
  category?: PostCategory | "all";
  feed?: "latest" | "best" | "following";
  page?: number;
}

export function usePosts({ category = "all", feed = "latest", page = 1 }: UsePostsOptions = {}) {
  return useQuery({
    queryKey: ["posts", { category, feed, page }],
    queryFn: () => {
      const params = new URLSearchParams({
        category,
        feed,
        page: String(page),
      });
      return fetchApi<PostsResponse>(`/api/posts?${params}`);
    },
    staleTime: 30 * 1000,
  });
}
