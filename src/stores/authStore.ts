"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { useCollectionStore } from "./collectionStore";

interface Profile {
  id: string;
  email: string;
  nickname: string;
  profile_image: string | null;
  bio: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  initialize: () => () => void;
  refreshSession: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const PROFILE_COLUMNS = "id, email, nickname, profile_image, bio";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchProfileWithRetry(
  supabase: SupabaseClient,
  userId: string,
  retries = 2
) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("id", userId)
        .maybeSingle();

      if (profile || error || attempt === retries - 1) {
        return profile ?? null;
      }
    } catch {
      return null;
    }

    await wait(300);
  }

  return null;
}

async function syncAuthState(
  supabase: SupabaseClient,
  user: User | null,
  set: (partial: Partial<AuthState>) => void
) {
  if (!user) {
    set({ user: null, profile: null, isLoggedIn: false, isLoading: false });
    return null;
  }

  // user_metadata로 즉시 로그인 상태 반영
  const fallbackProfile: Profile = {
    id: user.id,
    email: user.email ?? "",
    nickname: user.user_metadata?.nickname ?? user.email?.split("@")[0] ?? "사용자",
    profile_image: null,
    bio: null,
  };
  set({ user, profile: fallbackProfile, isLoggedIn: true, isLoading: false });

  // 백그라운드에서 profiles 테이블 + collections/ratings 조회
  fetchProfileWithRetry(supabase, user.id).then((profile) => {
    if (profile) {
      set({ profile });
    }
  });

  Promise.all([
    supabase.from("collections").select("id, user_id, game_id, status, created_at").eq("user_id", user.id),
    supabase.from("ratings").select("id, user_id, game_id, score, comment, created_at, updated_at").eq("user_id", user.id),
  ]).then(([collectionsRes, ratingsRes]) => {
    const collections = (collectionsRes.data ?? []).map((c) => ({
      id: c.id,
      userId: c.user_id,
      gameId: c.game_id,
      status: c.status,
      createdAt: c.created_at,
      // game field not needed for store initialization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any[];
    const ratings = (ratingsRes.data ?? []).map((r) => ({
      id: r.id,
      userId: r.user_id,
      gameId: r.game_id,
      score: r.score,
      comment: r.comment,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
    useCollectionStore.getState().initFromServer(collections, ratings);
  });

  return user;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoggedIn: false,
  isLoading: true,

  initialize: () => {
    const supabase = createClient();
    set({ isLoading: true });

    supabase.auth.getUser().then(({ data: { user } }) => {
      void syncAuthState(supabase, user, set);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await syncAuthState(supabase, session?.user ?? null, set);
        if (event === "SIGNED_OUT") {
          useCollectionStore.getState().reset();
        }
      }
    );

    return () => subscription.unsubscribe();
  },

  refreshSession: async () => {
    const supabase = createClient();
    set({ isLoading: true });
    const { data: { user } } = await supabase.auth.getUser();
    return syncAuthState(supabase, user, set);
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, profile: null, isLoggedIn: false, isLoading: false });
    useCollectionStore.getState().reset();
  },
}));
