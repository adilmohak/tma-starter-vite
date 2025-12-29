"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import React from "react";

// Simple, lightweight animation variants - only fade and blur
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const blurVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

// Simple, lightweight components - only FadeIn and BlurIn
interface SimpleAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FadeIn: React.FC<SimpleAnimationProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay, ease: "easeOut" }}
      style={{ willChange: "opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const BlurIn: React.FC<SimpleAnimationProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(2px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
      style={{
        willChange: "opacity, filter",
        // Ensure enough space for blur to render without clipping
        padding: "0.1px",
        margin: "-0.1px",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export { AnimatePresence };
