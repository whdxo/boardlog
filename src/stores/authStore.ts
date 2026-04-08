"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoggedIn: false,
  isLoading: true,

  initialize: () => {
    const supabase = createClient();

    // 현재 세션 복구
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, nickname, profile_image, bio")
          .eq("id", user.id)
          .maybeSingle();

        set({ user, profile, isLoggedIn: true, isLoading: false });
      } else {
        set({ user: null, profile: null, isLoggedIn: false, isLoading: false });
      }
    });

    // 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, email, nickname, profile_image, bio")
            .eq("id", session.user.id)
            .maybeSingle();

          set({ user: session.user, profile, isLoggedIn: true, isLoading: false });
        } else {
          set({ user: null, profile: null, isLoggedIn: false, isLoading: false });
        }
      }
    );

    // cleanup 함수 반환
    return () => subscription.unsubscribe();
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, profile: null, isLoggedIn: false });
  },
}));
