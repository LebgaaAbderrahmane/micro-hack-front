"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addOperator(formData: FormData) {
  const supabase = await createClient();

  // 1. Verify if the current user is an Admin
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from('users')
    .select('role, org_id')
    .eq('id', currentUser.id)
    .single();

  if (profile?.role !== 'ADMIN') {
    throw new Error("Only admins can add operation users");
  }

  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string; // Ideally you'd use inviteUserByEmail

  // 2. Create the operator user in Auth
  // In a real app with service role, you'd use admin.createUser
  // Here we use signUp as a placeholder if public signup is enabled, 
  // but normally an admin would use a service client.
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message || "Failed to create auth user");
  }

  // 3. Create or update the profile for the operator
  const rawRole = (formData.get("role") as string) || 'OPERATOR';
  const roleMap: Record<string, string> = {
    'ADMIN': 'ADMIN',
    'OPERATOR': 'OPERATOR',
    'CARRIER': 'DISPATCHER'
  };
  const role = roleMap[rawRole] || 'OPERATOR';

  const { error: profileError } = await supabase
    .from('users')
    .upsert({
      id: authData.user.id,
      username: username,
      org_id: profile.org_id,
      role: role as any
    }, { onConflict: 'id' });

  if (profileError) {
    throw new Error(profileError.message);
  }

  revalidatePath("/users");
}
