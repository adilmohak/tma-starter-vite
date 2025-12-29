"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  type: number;
  side: number;
  typeSize: number;
  xFinished: number;
  finishedStart: number;
  x: number;
  y: number;
  rotation: number;
  moveX: number;
  moveY: number;
  scale: number;
  rotationSpeed: number;
}

interface SunflowerOverlayProps {
  onStop?: () => void;
}

// Device performance based constants
const PARTICLES_COUNT = 40;
const FALL_PARTICLES_COUNT = 15;

const SunflowerOverlay: React.FC<SunflowerOverlayProps> = ({ onStop }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const speedCoefRef = useRef(1.0);
  const fallingDownCountRef = useRef(0);
  const startedFallRef = useRef(false);

  const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const createParticle = (fall: boolean): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as Particle;

    const side = Math.floor(random(0, 2));
    const finishedStart = 1 + Math.floor(random(0, 2));
    const typeSize = 20 + random(0, 15); // Size for emoji
    const scale = 0.8 + random(0, 0.4); // Random scale between 0.8 and 1.2

    let x = 0;
    let y = 0;
    let moveX = 0;
    let moveY = 0;
    let xFinished = 0;

    if (fall) {
      y = -random(0, canvas.height * 1.2);
      x = 5 + random(0, canvas.width - 10);
      xFinished = finishedStart;
    } else {
      const xOffset = 4 + Math.floor(random(0, 10));
      const yOffset = canvas.height / 4;
      x = side === 0 ? -xOffset : canvas.width + xOffset;
      moveX = (side === 0 ? 1 : -1) * (1.2 + random(0, 4));
      moveY = -(4 + random(0, 4));
      y = yOffset / 2 + random(0, yOffset * 2);
    }

    return {
      type: 0, // Only one type for emoji
      side,
      typeSize,
      xFinished,
      finishedStart,
      x,
      y,
      rotation: random(0, 360),
      moveX,
      moveY,
      scale,
      rotationSpeed: random(2, 8),
    };
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const { x, y, typeSize, rotation, scale } = particle;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    // Set font size and draw emoji
    ctx.font = `${typeSize}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw the sunflower emoji
    ctx.fillText("🌻", 0, 0);

    ctx.restore();
  };

  const updateParticle = (particle: Particle, dt: number): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return true;

    const moveCoef = dt / 16.0;
    particle.x += particle.moveX * moveCoef;
    particle.y += particle.moveY * moveCoef;

    // Handle horizontal movement
    if (particle.xFinished !== 0) {
      const dp = 0.5;
      if (particle.xFinished === 1) {
        particle.moveX += dp * moveCoef * 0.05;
        if (particle.moveX >= dp) {
          particle.xFinished = 2;
        }
      } else {
        particle.moveX -= dp * moveCoef * 0.05;
        if (particle.moveX <= -dp) {
          particle.xFinished = 1;
        }
      }
    } else {
      if (particle.side === 0 && particle.moveX > 0) {
        particle.moveX -= moveCoef * 0.05;
        if (particle.moveX <= 0) {
          particle.moveX = 0;
          particle.xFinished = particle.finishedStart;
        }
      } else if (particle.side === 1 && particle.moveX < 0) {
        particle.moveX += moveCoef * 0.05;
        if (particle.moveX >= 0) {
          particle.moveX = 0;
          particle.xFinished = particle.finishedStart;
        }
      }
    }

    // Handle vertical movement
    const yEdge = -0.5;
    const wasNegative = particle.moveY < yEdge;

    if (particle.moveY > yEdge) {
      particle.moveY += (1 / 3) * moveCoef * speedCoefRef.current;
    } else {
      particle.moveY += (1 / 3) * moveCoef;
    }

    if (wasNegative && particle.moveY > yEdge) {
      fallingDownCountRef.current++;
    }

    // Handle rotation - emojis rotate slower for better visual appeal
    particle.rotation =
      (particle.rotation + moveCoef * particle.rotationSpeed) % 360;

    // Scale animation - gentle pulsing effect
    const time = performance.now() / 1000;
    particle.scale =
      0.8 + 0.2 * (1 + Math.sin(time * 3 + particle.x * 0.01)) * 0.5;

    return particle.y >= canvas.height + 50; // Give some extra margin for emoji size
  };

  const animate = (timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dt = Math.min(timestamp - lastUpdateTimeRef.current, 17);
    lastUpdateTimeRef.current = timestamp;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      drawParticle(ctx, particle);
      return !updateParticle(particle, dt);
    });

    // Start fall animation if needed
    if (
      fallingDownCountRef.current >= PARTICLES_COUNT / 2 &&
      speedCoefRef.current > 0.2
    ) {
      if (!startedFallRef.current) {
        startedFallRef.current = true;
        const fallParticles = Array(FALL_PARTICLES_COUNT)
          .fill(null)
          .map(() => createParticle(true));
        particlesRef.current.push(...fallParticles);
      }
      speedCoefRef.current = Math.max(
        0.2,
        speedCoefRef.current - (dt / 16.0) * 0.15
      );
    }

    // Continue animation if there are particles
    if (particlesRef.current.length > 0) {
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

    // Create initial particles
    particlesRef.current = Array(PARTICLES_COUNT)
      .fill(null)
      .map(() => createParticle(false));

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

export default SunflowerOverlay;
