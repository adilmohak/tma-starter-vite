"use client";

import React, { useEffect, useRef } from "react";

interface EmojiParticle {
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  moveX: number;
  moveY: number;
  size: number;
  opacity: number;
  rotationSpeed: number;
}

interface SadEmojisProps {
  onStop?: () => void;
  duration?: number;
}

const SAD_EMOJIS = ["😭", "🥲", "🥹", "😫", "🙄"];

// Device performance based constants
const PARTICLES_COUNT = 20;
const FALL_PARTICLES_COUNT = 10;
const SPAWN_INTERVAL = 300; // milliseconds between each emoji spawn

const SadEmojisOverlay: React.FC<SadEmojisProps> = ({
  onStop,
  duration = 4000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<EmojiParticle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const speedCoefRef = useRef(1.0);
  const fallingDownCountRef = useRef(0);
  const startedFallRef = useRef(false);
  const nextSpawnTimeRef = useRef<number>(0);
  const spawnedCountRef = useRef<number>(0);

  const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const createEmojiParticle = (fall: boolean): EmojiParticle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as EmojiParticle;

    const emoji = SAD_EMOJIS[Math.floor(random(0, SAD_EMOJIS.length))];
    const size = 20 + random(0, 20); // Size between 20-40px

    let x = 0;
    let y = 0;
    let moveX = 0;
    let moveY = 0;

    if (fall) {
      y = -random(0, canvas.height * 0.5);
      x = random(size, canvas.width - size);
      moveY = random(1, 3);
      moveX = random(-1, 1);
    } else {
      const side = Math.floor(random(0, 2));
      const xOffset = size + Math.floor(random(0, 20));
      const yOffset = canvas.height / 4;
      x = side === 0 ? -xOffset : canvas.width + xOffset;
      moveX = (side === 0 ? 1 : -1) * random(1, 3);
      moveY = random(-2, 2);
      y = yOffset / 2 + random(0, yOffset * 2);
    }

    return {
      emoji,
      x,
      y,
      rotation: random(0, 360),
      moveX,
      moveY,
      size,
      opacity: random(0.7, 1),
      rotationSpeed: random(-5, 5),
    };
  };

  const drawEmojiParticle = (
    ctx: CanvasRenderingContext2D,
    particle: EmojiParticle
  ) => {
    const { x, y, emoji, size, rotation, opacity } = particle;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.font = `${size}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 0, 0);
    ctx.restore();
  };

  const updateEmojiParticle = (
    particle: EmojiParticle,
    dt: number
  ): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return true;

    const moveCoef = dt / 16.0;
    particle.x += particle.moveX * moveCoef;
    particle.y += particle.moveY * moveCoef;

    // Add gravity
    particle.moveY += 0.2 * moveCoef * speedCoefRef.current;

    // Add some horizontal drift
    particle.moveX += random(-0.1, 0.1) * moveCoef;

    // Update rotation
    particle.rotation += particle.rotationSpeed * moveCoef;

    // Fade out over time
    particle.opacity -= 0.005 * moveCoef;

    // Bounce off walls gently
    if (
      particle.x <= particle.size ||
      particle.x >= canvas.width - particle.size
    ) {
      particle.moveX *= -0.5;
      particle.x = Math.max(
        particle.size,
        Math.min(canvas.width - particle.size, particle.x)
      );
    }

    // Remove if out of bounds or too transparent
    return (
      particle.y >= canvas.height + particle.size ||
      particle.opacity <= 0 ||
      particle.x < -particle.size ||
      particle.x > canvas.width + particle.size
    );
  };

  const animate = (timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    if (startTimeRef.current === 0) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const dt = Math.min(timestamp - lastUpdateTimeRef.current, 17);
    lastUpdateTimeRef.current = timestamp;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn new emojis one by one at intervals
    if (
      spawnedCountRef.current < PARTICLES_COUNT &&
      elapsed >= nextSpawnTimeRef.current
    ) {
      const newParticle = createEmojiParticle(false);
      particlesRef.current.push(newParticle);
      spawnedCountRef.current++;
      nextSpawnTimeRef.current = elapsed + SPAWN_INTERVAL;
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      drawEmojiParticle(ctx, particle);
      return !updateEmojiParticle(particle, dt);
    });

    // Start fall animation if needed (after half the emojis have been spawned)
    if (
      spawnedCountRef.current >= PARTICLES_COUNT / 2 &&
      speedCoefRef.current > 0.3
    ) {
      if (!startedFallRef.current) {
        startedFallRef.current = true;
        // Spawn fall particles one by one as well, but faster
        for (let i = 0; i < FALL_PARTICLES_COUNT; i++) {
          setTimeout(() => {
            const fallParticle = createEmojiParticle(true);
            particlesRef.current.push(fallParticle);
          }, i * (SPAWN_INTERVAL / 2));
        }
      }
      speedCoefRef.current = Math.max(
        0.3,
        speedCoefRef.current - (dt / 16.0) * 0.1
      );
    }

    // Continue animation if there are particles or still spawning, and within duration
    if (
      (particlesRef.current.length > 0 ||
        spawnedCountRef.current < PARTICLES_COUNT) &&
      elapsed < duration
    ) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      onStop?.();
    }
  };

  const start = () => {
    // Reset state
    speedCoefRef.current = 1.0;
    fallingDownCountRef.current = 0;
    startedFallRef.current = false;
    startTimeRef.current = 0;
    spawnedCountRef.current = 0;
    nextSpawnTimeRef.current = 0;

    // Start with empty particles array - they will be spawned one by one
    particlesRef.current = [];

    // Start animation
    lastUpdateTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const updateSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Start animation
    start();

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[9999]"
    />
  );
};

export default SadEmojisOverlay;
