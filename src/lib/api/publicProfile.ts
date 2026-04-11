import { createClient } from "@/lib/supabase/client";

export async function getProfileByNickname(nickname: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nickname, profile_image, bio")
    .eq("nickname", nickname)
    .single();

  if (error) throw error;
  return data;
}
