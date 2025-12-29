"use client";

import React from "react";
import { FadeIn, BlurIn } from "./motion";

// Simple animation wrapper - only fade or blur
interface AnimateProps {
  children: React.ReactNode;
  type?: "fade" | "blur";
  delay?: number;
  className?: string;
}

export const Animate: React.FC<AnimateProps> = ({
  children,
  type = "fade",
  delay = 0,
  className = "",
}) => {
  if (type === "blur") {
    return (
      <BlurIn delay={delay} className={className}>
        {children}
      </BlurIn>
    );
  }

  return (
    <FadeIn delay={delay} className={className}>
      {children}
    </FadeIn>
  );
};

// Direct exports for convenience
export { FadeIn, BlurIn };
