"use client";

import { DotLottie } from "@lottiefiles/dotlottie-web";
import React, { useEffect, useRef } from "react";
import { useModalState } from "@/store/ui-store";

interface LottiePlayerProps {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  width?: number;
  height?: number;
  speed?: number;
  dotLottieRefCallback?: (player: DotLottie) => void;
  // Set to true for animations that should continue playing even when modals are open
  ignoreModalState?: boolean;
}

export default function LottiePlayer({
  src,
  autoplay = true,
  loop = true,
  className,
  width = 86,
  height = 86,
  speed = 1,
  dotLottieRefCallback,
  ignoreModalState = false,
}: LottiePlayerProps) {
  const { hasOpenModal } = useModalState();
  const containerRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<DotLottie | null>(null);
  const wasPlayingRef = useRef<boolean>(false);

  // Initialize DotLottie player
  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = containerRef.current;

    // Set canvas internal dimensions to match CSS dimensions
    // Use devicePixelRatio of 1 to prevent buffer size mismatches
    // when parent containers are scaled or transformed
    canvas.width = width;
    canvas.height = height;

    const dotLottie = new DotLottie({
      canvas: canvas,
      src,
      autoplay,
      loop,
      speed,
      renderConfig: {
        devicePixelRatio: 1, // Fixes buffer size mismatch with transforms
      },
    });

    playerRef.current = dotLottie;

    if (dotLottieRefCallback) {
      dotLottieRefCallback(dotLottie);
    }

    return () => {
      dotLottie.destroy();
    };
  }, [src, autoplay, loop, speed, width, height, dotLottieRefCallback]);

  // Handle pause/resume based on modal state
  useEffect(() => {
    if (!playerRef.current || ignoreModalState) return;

    if (hasOpenModal) {
      // Store if animation was playing before pausing
      if (playerRef.current.isPlaying) {
        wasPlayingRef.current = true;
        playerRef.current.pause();
      }
    } else {
      // Resume if it was playing before
      if (wasPlayingRef.current) {
        playerRef.current.play();
        wasPlayingRef.current = false;
      }
    }
  }, [hasOpenModal, ignoreModalState]);

  return (
    <canvas
      ref={containerRef}
      className={className}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
