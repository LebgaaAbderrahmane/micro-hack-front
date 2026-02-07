"use client";

import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { User, Organisation, UserRole } from "@/types/models/auth";
import { useRouter, usePathname } from "@/i18n/routing";

export type Profile = User & {
  organisation?: Organisation;
};

interface AuthContextType {
  user: SupabaseUser | null;
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
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const lastFetchedUserId = useRef<string | null>(null);
  const fetchInProgress = useRef<string | null>(null);
  const hasInitialized = useRef(false);

  // Use a stable reference for the Supabase client
  const [supabase] = useState(() => createClient());

  const fetchProfile = useCallback(
    async (userId: string, retryCount = 0): Promise<Profile | null> => {
      // Avoid overlapping fetches for the same user
      if (fetchInProgress.current === userId && retryCount === 0) return null;

      try {
        fetchInProgress.current = userId;
        console.log(`[AuthProvider] Fetching profile for ${userId} (attempt ${retryCount + 1})`);

        // Try to fetch with organisation details first
        const { data, error } = await supabase
          .from("users")
          .select("*, organisation:organisations(*)")
          .eq("id", userId)
          .maybeSingle();

        if (data) {
          console.log("[AuthProvider] Profile fetch success:", data.role);
          return data as Profile;
        }

        if (error) {
          console.error("[AuthProvider] Profile fetch error details:", {
            code: error.code,
            message: error.message,
          });
        }

        return null;
      } catch (err) {
        console.error("[AuthProvider] Profile fetch exception:", err);
        return null;
      } finally {
        if (retryCount === 0) {
          fetchInProgress.current = null;
        }
      }
    },
    [supabase],
  );

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (hasInitialized.current) {
        console.log("[AuthProvider] Already initialized, skipping...");
        return;
      }
      hasInitialized.current = true;

      // Safety timeout
      const timeoutId = setTimeout(() => {
        if (mounted && isLoading) {
          console.warn("[AuthProvider] Auth initialization timeout reached. Unblocking UI.");
          setIsLoading(false);
        }
      }, 8000);

      try {
        console.log("[AuthProvider] Fetching initial session...");
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[AuthProvider] Initial session error:", sessionError);
          // If the refresh token is invalid/not found, we should ensure clean state
          if (sessionError.message?.includes("refresh_token_not_found") || sessionError.status === 400) {
            console.warn("[AuthProvider] Refresh token invalid. Performing clean sign out.");
            await supabase.auth.signOut();
          }
        }

        if (!mounted) return;

        console.log("[AuthProvider] Initializing session state:", !!initialSession);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          // fetch "Real" Profile (enhancement)
          if (lastFetchedUserId.current !== initialSession.user.id) {
            lastFetchedUserId.current = initialSession.user.id;
            const profileData = await fetchProfile(initialSession.user.id);
            if (mounted) {
              if (profileData) {
                setProfile(profileData);
                setIsLoading(false);
              } else {
                console.error("[AuthProvider] Strictly Enforced: Profile check failed, no fallback. Signing out.", {
                  userId: initialSession.user.id,
                });
                await signOut();
              }
            }
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[AuthProvider] Initialization error:", error);
        if (mounted) {
          setProfile(null);
          setSession(null);
          setIsLoading(false);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log(`[AuthProvider] State change: ${event}`);

      if (!mounted) return;

      // When a SIGNED_IN or INITIAL_SESSION event happens with a NEW user, we should ensure isLoading is true
      // until we have confirmed the profile. TOKEN_REFRESHED should NOT trigger loading.
      const isNewUser = newSession?.user && newSession.user.id !== lastFetchedUserId.current;
      if (newSession?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION") && isNewUser) {
        setIsLoading(true);
      }

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // Background fetch "Real" Profile - ONLY if user changed or profile missing
        if (lastFetchedUserId.current !== newSession.user.id || !profile) {
          lastFetchedUserId.current = newSession.user.id;
          const profileData = await fetchProfile(newSession.user.id);
          if (mounted) {
            if (profileData) {
              setProfile(profileData);
              setIsLoading(false);
            } else {
              console.error("[AuthProvider] Strictly Enforced: Profile check failed on state change. Signing out.", {
                userId: newSession.user.id
              });
              await signOut();
            }
          }
        } else {
          setIsLoading(false);
        }
      } else if (event === "SIGNED_OUT") {
        console.log("[AuthProvider] Handled SIGNED_OUT event");
        setProfile(null);
        lastFetchedUserId.current = null;
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  // Client-side Navigation Guard (SPA Protection)
  useEffect(() => {
    if (isLoading) {
      console.log("[AuthProvider] Guard: Still loading, skipping...");
      return;
    }

    const isAuthPage = /\/(login|register|auth\/callback)/.test(pathname);
    const targetIsHome = pathname === "/" || pathname === "";

    console.log(`[AuthProvider] Guard: Path="${pathname}", isAuthPage=${isAuthPage}, hasSession=${!!session}`);

    if (!session && !isAuthPage) {
      console.log("[AuthProvider] Guard: Redirecting to /login (Unauthenticated)");
      router.push("/login");
    } else if (session && isAuthPage && !pathname.includes("auth/callback")) {
      console.log("[AuthProvider] Guard: Redirecting to / (Authenticated)");
      router.push("/");
    } else if (session && targetIsHome && profile) {
      // Optional: Ensure we are on the right dashboard? No, let page handle it.
      console.log("[AuthProvider] Guard: Already on dashboard/authorized area.");
    }
  }, [session, isLoading, pathname, router, profile]);

  const signOut = async () => {
    setProfile(null);
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
    router.push("/login");
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
