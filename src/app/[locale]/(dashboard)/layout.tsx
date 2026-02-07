import { setRequestLocale } from "next-intl/server";
import { MainLayout } from "@/components/layout/MainLayout";
import { Suspense } from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <MainLayout>{children}</MainLayout>
    </Suspense>
  );
}
