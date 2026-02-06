"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "../common/Toast";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [mswReady, setMswReady] = useState(false);

    useEffect(() => {
        async function init() {
            if (process.env.NODE_ENV === "development") {
                const { initMocks } = await import("@/mocks");
                await initMocks();
            }
            setMswReady(true);
        }
        init();
    }, []);

    if (!mswReady) return null;

    return (
        <QueryClientProvider client={queryClient}>
            <ToastContainer />
            {children}
        </QueryClientProvider>
    );
}
