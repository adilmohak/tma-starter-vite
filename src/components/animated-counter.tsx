"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedCounter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  useEffect(() => {
    const controls = animate(count, value, { duration: 5 });
    return () => controls.stop();
  }, [value]);

  return <motion.pre className={className}>{rounded}</motion.pre>;
}
