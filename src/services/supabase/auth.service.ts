import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
  },

  async signInWithEmail(email: string) {
    const supabase = createClient();
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
  }
};
