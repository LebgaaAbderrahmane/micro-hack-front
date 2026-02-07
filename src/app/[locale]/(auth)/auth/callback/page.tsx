import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { Loader2 } from "lucide-react";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AuthCallbackPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={
       <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Initializing...</p>
      </div>
    }>
      <AuthCallbackClient />
    </Suspense>
  );
}
