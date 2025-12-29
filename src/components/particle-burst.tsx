import { useEffect, useRef } from "react";

/**
 * ParticleBurst Component - Optimized for Performance
 *
 * PERFORMANCE TUNING GUIDE:
 *
 * 1. Speed Control (via props):
 *    - speed={0.1} = Very slow (best performance)
 *    - speed={0.3} = Default (balanced)
 *    - speed={0.6} = Medium speed
 *    - speed={1.0} = Fast (higher CPU usage)
 *
 * 2. Additional Performance Settings (modify in code):
 *    - Line 179: spawnRate interval (300ms = slower spawning)
 *    - Line 180: maxParticles (400 = fewer particles)
 *    - Line 183: particlesPerBatch (3 = fewer particles per spawn)
 *    - Line 138: maxLife automatically adjusts with speed (slower = longer life)
 *
 * Note: Particle lifespan automatically increases when speed decreases to maintain
 * consistent visual spread. This ensures slower particles travel the same distance.
 *
 * Current settings are optimized for mobile devices and lower-end hardware.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticleBurstProps {
  speed?: number; // Speed multiplier for particle movement (0.1 = very slow, 1.0 = fast). Lower values = better performance
}

export default function ParticleBurst({
  speed = 0.3, // Reduced default speed for better performance
}: ParticleBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    let startTime = Date.now();
    let particlesSpawned = 0;

    const createParticle = (
      centerX: number,
      centerY: number,
      intensity: number = 1
    ) => {
      // For landscape containers, favor horizontal movement
      // 60% chance for horizontal sectors, 40% for other directions
      let angle: number;

      if (Math.random() < 0.6) {
        // Balanced horizontal movement: 50% left, 50% right
        if (Math.random() < 0.5) {
          // Left direction: 150° to 210° (5π/6 to 7π/6)
          angle = Math.random() * (Math.PI / 3) + (5 * Math.PI) / 6;
        } else {
          // Right direction: -30° to 30° (-π/6 to π/6)
          angle = Math.random() * (Math.PI / 3) - Math.PI / 6;
        }
      } else {
        // Other directions (up, down, diagonals)
        const sectors = 6; // Remaining sectors
        const sectorSize = (2 * Math.PI) / 8; // Keep original sector size
        const availableSectors = [1, 2, 5, 6, 7, 0]; // Exclude the main horizontal sectors
        const randomSectorIndex = Math.floor(
          Math.random() * availableSectors.length
        );
        const sector = availableSectors[randomSectorIndex];
        const angleInSector = Math.random() * sectorSize;
        angle = sector * sectorSize + angleInSector;
      }

      const baseSpeed = (Math.random() * 1.5 + 1.2) * intensity * speed;
      const size = Math.random() * 3 + 1.5; // Smaller dots

      // Violet color palette - different contrasts and intensities
      const violentColors = [
        "#8a2be2", // Blue violet (normal violet)
        "#9932cc", // Dark orchid
        "#9400d3", // Dark violet
        "#8b00ff", // Electric violet
        "#7b68ee", // Medium slate blue (lighter violet)
        "#6a5acd", // Slate blue
        "#483d8b", // Dark slate blue (deep violet)
        "#4b0082", // Indigo (very deep violet)
        "#663399", // Rebecca purple
        "#5d4e75", // Dark violet gray
        "#9966cc", // Amethyst (whiter violet)
        "#dda0dd", // Plum (very light violet)
        "#ba55d3", // Medium orchid (bright violet)
        "#da70d6", // Orchid (whiter violet)
        "#ee82ee", // Violet (light violet)
        "#6633cc", // Strong violet
      ];
      const randomColor =
        violentColors[Math.floor(Math.random() * violentColors.length)];

      // Calculate velocity components with landscape bias
      let vx = Math.cos(angle) * baseSpeed;
      let vy = Math.sin(angle) * baseSpeed;

      // Enhanced horizontal bias for landscape containers
      const horizontalMultiplier = 1.8; // Stronger horizontal movement
      const verticalMultiplier = 0.6; // Reduced vertical movement

      vx *= horizontalMultiplier;
      vy *= verticalMultiplier;

      return {
        x: centerX,
        y: centerY,
        vx: vx,
        vy: vy,
        life: 0,
        maxLife: (Math.random() * 80 + 40) / speed, // Lifespan inversely proportional to speed - slower particles live longer
        size: size,
        opacity: 1,
        color: randomColor,
      };
    };

    // Function to draw a simple dot/circle
    const drawDot = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number,
      color: string
    ) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Add a subtle glow effect for more violent appearance
      ctx.shadowBlur = size * 1.2;
      ctx.shadowColor = color;
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Optimized particle spawning for better performance
      const spawnRate = Math.floor(elapsed / 300); // Slower spawning interval for performance
      if (particlesSpawned < spawnRate && particlesRef.current.length < 400) {
        // Reduced max particles from 600 to 400
        // Spawn fewer particles per batch for smoother performance
        for (let i = 0; i < 3; i++) {
          // Reduced from 5 to 3 particles per batch
          particlesRef.current.push(createParticle(centerX, centerY, 0.8));
        }
        particlesSpawned++;
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // More dramatic opacity fade for violent effect
        const fadeProgress = particle.life / particle.maxLife;
        particle.opacity = Math.max(0, 1 - Math.pow(fadeProgress, 1.5));

        // Draw the dot
        drawDot(
          ctx,
          particle.x,
          particle.y,
          particle.size,
          particle.opacity,
          particle.color
        );

        return (
          particle.life < particle.maxLife &&
          particle.x > -100 &&
          particle.x < canvas.width + 100 &&
          particle.y > -50 &&
          particle.y < canvas.height + 50
        );
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute h-full w-full inset-0 pointer-events-none"
    />
  );
}
