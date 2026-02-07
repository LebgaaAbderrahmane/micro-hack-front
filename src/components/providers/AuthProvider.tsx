"use client";

import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/database.types";
import { signOutAction } from "@/app/[locale]/(auth)/actions";

type Profile = Database["public"]["Tables"]["users"]["Row"] & {
  organisation?: Database["public"]["Tables"]["organisations"]["Row"];
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use a stable reference for the Supabase client
  const [supabase] = useState(() => createClient());

  const fetchProfile = useCallback(
    async (userId: string, retryCount = 0): Promise<Profile | null> => {
      try {
        // Try to fetch with organisation details first
        const { data, error } = await supabase
          .from("users")
          .select("*, organisation:organisations(*)")
          .eq("id", userId)
          .single();

        if (!error && data) {
          return data as Profile;
        }

        // If we get an empty error in dev, it might be MSW still booting
        if (process.env.NODE_ENV === "development" && retryCount < 2) {
          console.log(`[AuthProvider] Potential race with MSW, retrying... (${retryCount + 1})`);
          await new Promise(resolve => setTimeout(resolve, 500));
          return fetchProfile(userId, retryCount + 1);
        }

        console.warn("[AuthProvider] Detailed profile fetch failed, trying basic fetch:", error);

        // Fallback: Fetch just the user profile without organisation if the join fails
        const { data: basicData, error: basicError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (basicError) {
          console.error("[AuthProvider] Basic profile fetch error:", {
            message: basicError.message,
            details: basicError.details,
            hint: basicError.hint,
            code: basicError.code
          });
          return null;
        }

        return basicData as Profile;
      } catch (err) {
        console.error("[AuthProvider] Profile fetch exception:", err);
        return null;
      }
    },
    [supabase],
  );

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      // Safety timeout to prevent infinite loading if Supabase hangs
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.warn(
            "[AuthProvider] Auth initialization timed out - forcing loading to false",
          );
          setIsLoading(false);
        }
      }, 5000);

      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // 1. Optimistic Profile from Metadata (Backup)
          const metadata = currentSession.user.user_metadata;
          if (metadata?.role) {
            console.log("[AuthProvider] Using optimistic profile from metadata");
            const optimisticProfile = {
              id: currentSession.user.id,
              role: metadata.role,
              username: metadata.username || currentSession.user.email?.split("@")[0],
              email: currentSession.user.email,
              org_id: metadata.org_id,
              created_at: new Date().toISOString()
            } as Profile;
            setProfile(optimisticProfile);
          }

          // 2. Fetch Real Profile from DB
          const profileData = await fetchProfile(currentSession.user.id);

          // 3. Confirm Profile (DB takes precedence, keep optimistic if DB fails)
          if (mounted) {
            if (profileData) {
              setProfile(profileData);
            } else if (!metadata?.role) {
              // Only clear if we didn't have an optimistic profile
              setProfile(null);
            }
          }
        }
      } catch (error) {
        console.error("[AuthProvider] Initialization error:", error);
      } finally {
        if (mounted) setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log(`[AuthProvider] State change: ${event}`, {
        userId: newSession?.user?.id,
      });

      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // 1. Optimistic Profile
        const metadata = newSession.user.user_metadata;
        if (metadata?.role) {
          const optimisticProfile = {
            id: newSession.user.id,
            role: metadata.role,
            username: metadata.username || newSession.user.email?.split("@")[0],
            email: newSession.user.email,
            org_id: metadata.org_id,
            created_at: new Date().toISOString()
          } as Profile;
          setProfile(optimisticProfile);
        }

        // 2. Fetch Real Profile
        const profileData = await fetchProfile(newSession.user.id);

        if (mounted) {
          if (profileData) {
            setProfile(profileData);
          } else if (!metadata?.role) {
            setProfile(null);
          }
        }
      } else {
        if (mounted) setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signOut = async () => {
    // 1. Clear local state for immediate feedback
    setProfile(null);
    setUser(null);
    setSession(null);

    // 2. Call server action to clear cookies and redirect
    // This will trigger a redirect to /login
    await signOutAction();
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, session, isLoading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
