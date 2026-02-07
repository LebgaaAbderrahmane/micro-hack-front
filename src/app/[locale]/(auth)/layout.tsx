import { setRequestLocale } from "next-intl/server";
import React, { Suspense } from "react";

export default async function AuthLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0b] relative overflow-hidden font-poppins">
      {/* Background elements specific to auth if needed */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"
        suppressHydrationWarning
      ></div>
      <div className="relative z-10 w-full" suppressHydrationWarning>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
