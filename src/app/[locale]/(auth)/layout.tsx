import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0a0a0b] relative overflow-hidden"
      suppressHydrationWarning
    >
      {/* Background elements specific to auth if needed */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"
        suppressHydrationWarning
      ></div>
      <div className="relative z-10 w-full" suppressHydrationWarning>
        {children}
      </div>
    </div>
  );
}
