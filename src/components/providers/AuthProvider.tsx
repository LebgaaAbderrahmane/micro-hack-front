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
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use a stable reference for the Supabase client
  const [supabase] = useState(() => createClient());

  const fetchProfile = useCallback(
    async (userId: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*, organisation:organisations(*)")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("[AuthProvider] Profile fetch error:", error);
          return null;
        }
        return data as Profile;
      } catch (err) {
        console.error("[AuthProvider] Profile fetch exception:", err);
        return null;
      } finally {
        clearTimeout(timeoutId);
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
        // Log all cookies to see if the session cookie is present
        if (typeof document !== "undefined") {
          const hasSBCookie =
            document.cookie.includes("sb-") ||
            document.cookie.includes("supabase.auth.token");
          console.log("[AuthProvider] Browser cookie check:", { hasSBCookie });
        }

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        console.log("[AuthProvider] Boot session:", {
          hasSession: !!currentSession,
          userId: currentSession?.user?.id,
        });

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const profileData = await fetchProfile(currentSession.user.id);
          if (mounted) {
            if (!profileData) {
                console.warn("[AuthProvider] Profile data missing. Check RLS policies or database content.");
            }
            setProfile(profileData);
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
        const profileData = await fetchProfile(newSession.user.id);
        if (mounted) setProfile(profileData);
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
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
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
