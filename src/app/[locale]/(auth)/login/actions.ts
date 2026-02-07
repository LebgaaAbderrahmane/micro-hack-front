"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  console.log("[Login Action] Starting login process...");
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const requiredRole = formData.get("requiredRole") as string;

  console.log(`[Login Action] Attempting login for: ${email}, role: ${requiredRole || 'any'}`);

  const getRedirectPath = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "/login/admin";
      case "OPERATOR":
        return "/login/operator";
      case "DISPATCHER":
        return "/login/carrier";
      default:
        return "/login";
    }
  };

  const redirectPath = getRedirectPath(requiredRole);

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) {
    console.error(`[Login Action] SignIn failed: ${authError.message}`);
    redirect(`${redirectPath}?error=Invalid credentials`);
  }

  if (!authData.user) {
    console.error("[Login Action] SignIn succeeded but no user returned.");
    redirect(`${redirectPath}?error=Invalid credentials`);
  }

  console.log(`[Login Action] Auth successful for user: ${authData.user.id}. Fetching profile...`);

  // Verify Role and Organization
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*, organisation:organisations(*)")
    .eq("id", authData.user.id)
    .single();

  if (profileError) {
    console.error(`[Login Action] Profile fetch failed: ${profileError.message}`);
    await supabase.auth.signOut();
    redirect(`${redirectPath}?error=Profile not found`);
  }
  
  if (!profile) {
    console.error("[Login Action] Profile not found (null data)");
    await supabase.auth.signOut();
    redirect(`${redirectPath}?error=Profile not found`);
  }

  console.log(`[Login Action] Profile found. Role: ${profile.role}`);

  if (requiredRole && profile.role !== requiredRole) {
    console.warn(`[Login Action] Role mismatch. Required: ${requiredRole}, Found: ${profile.role}`);
    await supabase.auth.signOut();
    redirect(
      `${redirectPath}?error=Unauthorized access: This account is registered as a ${profile.role}`,
    );
  }

  // Backup: Update user metadata with profile info to ensure client access even if DB fetch fails
  await supabase.auth.updateUser({
    data: {
      role: profile.role,
      username: profile.username,
      org_id: profile.org_id
    }
  });

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const orgName = formData.get("orgName") as string;
  const nif = formData.get("nif") as string;

  // 1. Sign up user in Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (authError || !authData.user) {
    redirect(
      `/login?error=${authError?.message || "Could not authenticate user"}`,
    );
  }

  // 2. Create Carrier Organization
  const { data: orgData, error: orgError } = await supabase
    .from("organisations")
    .insert({
      name: orgName,
      nif: nif,
      type: "CARRIER",
    })
    .select()
    .single();

  if (orgError) {
    // Note: In production you might want to cleanup the auth user here
    redirect(`/login?error=Failed to create organization: ${orgError.message}`);
  }

  // 3. Create User Profile
  const { error: profileError } = await supabase.from("users").insert({
    id: authData.user.id,
    username: username,
    org_id: orgData.id,
    role: "DISPATCHER", // Default role for new carriers
  });

  if (profileError) {
    redirect(
      `/login?error=Failed to create user profile: ${profileError.message}`,
    );
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/profile", "page");
  return { success: true };
}
