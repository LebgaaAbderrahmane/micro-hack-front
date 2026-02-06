import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/MainLayout";
import { Providers } from "@/components/layout/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ILACS | Intelligent Logistics Access Control System",
  description: "Advanced port access and terminal management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storage = localStorage.getItem('theme-storage');
                  const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  if (storage) {
                    const { state } = JSON.parse(storage);
                    if (state && state.theme === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else if (state && state.theme === 'light') {
                      document.documentElement.classList.remove('dark');
                    } else {
                      if (supportDarkMode) document.documentElement.classList.add('dark');
                    }
                  } else {
                    if (supportDarkMode) document.documentElement.classList.add('dark');
                    else document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })()
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background`} suppressHydrationWarning>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
