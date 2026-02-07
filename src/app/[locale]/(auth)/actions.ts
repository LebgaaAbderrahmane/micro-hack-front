"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/routing";

export async function signOutAction() {
  const supabase = await createClient();

  // 1. Sign out from Supabase (clears cookies)
  await supabase.auth.signOut();

  // 2. Invalidate all paths to clear cache
  revalidatePath("/", "layout");

  // 3. Simple redirect to login
  redirect({ href: "/login", locale: "en" });
}
