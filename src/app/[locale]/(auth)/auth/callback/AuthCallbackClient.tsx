"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    
    const handleCallback = async () => {
      // If code is present, exchange it
      if (code) {
        processed.current = true;
        const supabase = createClient();
        
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Auth callback error:", error);
            // If it's a known error, we show it, but proceed to redirect in case session is implicitly set
            toast.error("Authentication verification failed.");
            router.push("/auth/auth-code-error"); // Or login
            return;
          }
           
          toast.success("Verified successfully");
          router.push(next);
        } catch (error: any) {
          console.error("Auth callback exception:", error);
          toast.error("Authentication failed: " + error.message);
          router.push("/auth/auth-code-error");
        }
      } else {
         // No code. Assume implicit flow or just redirect to home/next
         console.log("No code in callback, redirecting to", next);
         router.push(next);
      }
    };

    handleCallback();
  }, [code, next, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse">Verifying authentication...</p>
    </div>
  );
}
