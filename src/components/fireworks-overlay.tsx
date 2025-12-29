"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  type: number;
  colorType: number;
  side: number;
  typeSize: number;
  xFinished: number;
  finishedStart: number;
  x: number;
  y: number;
  rotation: number;
  moveX: number;
  moveY: number;
}

interface FireworksProps {
  onStop?: () => void;
  withStars?: boolean;
}

const COLORS = [
  "#2CBCE8",
  "#9E04D0",
  "#FECB02",
  "#FD2357",
  "#278CFE",
  "#59B86C",
];

const STAR_COLORS = ["#1e80ff", "#10c689", "#ff5997", "#ff9724", "#2fe1f9"];

// Device performance based constants
const PARTICLES_COUNT = 50;
const FALL_PARTICLES_COUNT = 20;

const FireworksOverlay: React.FC<FireworksProps> = ({
  onStop,
  withStars = false,
}) => {
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

    const type = Math.floor(random(0, 2));
    const colorType = Math.floor(random(0, COLORS.length));
    const side = Math.floor(random(0, 2));
    const finishedStart = 1 + Math.floor(random(0, 2));
    const typeSize = type === 0 ? 4 + random(0, 2) : 4 + random(0, 4);

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
      type,
      colorType,
      side,
      typeSize,
      xFinished,
      finishedStart,
      x,
      y,
      rotation: 0,
      moveX,
      moveY,
    };
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const { x, y, type, colorType, typeSize, rotation } = particle;

    if (type === 0) {
      ctx.beginPath();
      ctx.fillStyle = COLORS[colorType];
      ctx.arc(x, y, typeSize, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 1) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillStyle = COLORS[colorType];
      ctx.fillRect(-typeSize, -2, typeSize * 2, 4);
      ctx.restore();
    } else if (type === 2 && withStars) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillStyle = STAR_COLORS[colorType];
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos(((18 + i * 72) * Math.PI) / 180) * typeSize,
          Math.sin(((18 + i * 72) * Math.PI) / 180) * typeSize
        );
        ctx.lineTo(
          Math.cos(((54 + i * 72) * Math.PI) / 180) * typeSize * 0.5,
          Math.sin(((54 + i * 72) * Math.PI) / 180) * typeSize * 0.5
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
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

    // Handle rotation
    if (particle.type === 1 || particle.type === 2) {
      particle.rotation = (particle.rotation + moveCoef * 10) % 360;
    }

    return particle.y >= canvas.height;
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

export default FireworksOverlay;
