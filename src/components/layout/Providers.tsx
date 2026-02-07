"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "../common/Toast";
import { AuthProvider } from "../providers/AuthProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { FloatingSettings } from "../common/FloatingSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function init() {
      if (process.env.NODE_ENV === "development") {
        const { initMocks } = await import("@/mocks");
        await initMocks();
      }
      setMswReady(true);
    }
    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {(!mswReady && process.env.NODE_ENV === "development") ? (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <AuthProvider>
            {mounted && <ToastContainer />}
            {children}
            {mounted && <FloatingSettings />}
          </AuthProvider>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
