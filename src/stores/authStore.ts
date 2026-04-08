"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient, User } from "@supabase/supabase-js";

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
  retries = 3
) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", userId)
      .maybeSingle();

    if (profile || error || attempt === retries - 1) {
      return profile ?? null;
    }

    await wait(250 * (attempt + 1));
  }

  return null;
}

async function syncAuthState(
  supabase: SupabaseClient,
  user: User | null,
  set: (partial: Partial<AuthState>) => void
) {
  console.log("[authStore] syncAuthState:start", {
    userId: user?.id ?? null,
    email: user?.email ?? null,
  });

  if (!user) {
    console.log("[authStore] syncAuthState:cleared");
    set({ user: null, profile: null, isLoggedIn: false, isLoading: false });
    return null;
  }

  const profile = await fetchProfileWithRetry(supabase, user.id);
  console.log("[authStore] syncAuthState:done", {
    userId: user.id,
    hasProfile: Boolean(profile),
    profileId: profile?.id ?? null,
    nickname: profile?.nickname ?? null,
  });
  set({ user, profile, isLoggedIn: true, isLoading: false });

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

    // 현재 세션 복구
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log("[authStore] initialize:getUser", {
        userId: user?.id ?? null,
        email: user?.email ?? null,
      });
      void syncAuthState(supabase, user, set);
    });

    // 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[authStore] onAuthStateChange", {
          event,
          userId: session?.user?.id ?? null,
          email: session?.user?.email ?? null,
        });
        await syncAuthState(supabase, session?.user ?? null, set);
      }
    );

    // cleanup 함수 반환
    return () => subscription.unsubscribe();
  },

  refreshSession: async () => {
    const supabase = createClient();
    set({ isLoading: true });
    console.log("[authStore] refreshSession:start");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("[authStore] refreshSession:getUser", {
      userId: user?.id ?? null,
      email: user?.email ?? null,
    });

    return syncAuthState(supabase, user, set);
  },

  signOut: async () => {
    const supabase = createClient();
    console.log("[authStore] signOut:start");
    await supabase.auth.signOut();
    console.log("[authStore] signOut:done");
    set({ user: null, profile: null, isLoggedIn: false, isLoading: false });
  },
}));
