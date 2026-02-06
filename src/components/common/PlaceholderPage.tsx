"use client";

import React from "react";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description = "This section is currently being redesigned. Check back soon.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-foreground/5 flex items-center justify-center">
        <Construction size={36} className="text-foreground/30" />
      </div>
      <div className="space-y-2">
        <h1
          className="text-content-title dark:text-foreground text-2xl"
          style={{
            fontFamily: "var(--font-poppins), sans-serif",
            fontWeight: 600,
          }}
        >
          {title}
        </h1>
        <p className="text-foreground/50 text-sm max-w-md">{description}</p>
      </div>
    </div>
  );
};
