"use client";

import { motion, AnimatePresence } from "framer-motion";
import LottiePlayer from "@/components/lottie-player";

interface LoadingOverlayProps {
  animationUrl?: string;
  loaded: boolean;
  className?: string;
  props?: any;
}

const LoadingOverlay = ({
  animationUrl,
  loaded,
  className,
  props,
}: LoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen bg-background z-[9999] flex items-center justify-center"
        >
          <LottiePlayer
            src={animationUrl ?? "/lottie/trophy.lottie"}
            width={66}
            height={66}
            className={className}
            {...props}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
