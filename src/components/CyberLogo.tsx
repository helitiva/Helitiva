import React, { useEffect, useRef, useState } from 'react';

interface CyberLogoProps {
  size?: number; // 64 or 128
  className?: string;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

export const CyberLogo: React.FC<CyberLogoProps> = ({ size = 64, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scanYRef = useRef<number>(0);
  const particlesRef = useRef<SparkParticle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const cx = size / 2;
    const cy = size / 2;
    // Scale properties based on size
    const scale = size / 40; // Base size was 40px
    const rectWidth = 5 * scale;
    const rectHeight = 19 * scale;
    const rx = 1.6 * scale;
    
    // Scan line vertical limits
    const yTop = cy - rectHeight / 2;
    const yBottom = cy + rectHeight / 2;
    
    if (scanYRef.current === 0) {
      scanYRef.current = yTop;
    }

    const drawRoundedRect = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      context.beginPath();
      context.moveTo(x + radius, y);
      context.lineTo(x + width - radius, y);
      context.quadraticCurveTo(x + width, y, x + width, y + radius);
      context.lineTo(x + width, y + height - radius);
      context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      context.lineTo(x + radius, y + height);
      context.quadraticCurveTo(x, y + height, x, y + height - radius);
      context.lineTo(x, y - radius + radius);
      context.quadraticCurveTo(x, y, x + radius, y);
      context.closePath();
      context.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // 1. Draw rounded outer box (card background)
      ctx.save();
      const gradBg = ctx.createLinearGradient(0, 0, size, size);
      gradBg.addColorStop(0, '#10b981');
      gradBg.addColorStop(0.5, '#00d9f5');
      gradBg.addColorStop(1, '#7c3aed');
      
      ctx.fillStyle = gradBg;
      drawRoundedRect(ctx, 0, 0, size, size, 11 * scale);
      ctx.restore();

      // 2. Draw H letter geometry in white
      ctx.save();
      ctx.fillStyle = '#ffffff';

      // Left bar: rect at x=11, y=10.5, w=5, h=19
      const leftX = 11 * scale;
      const leftY = 10.5 * scale;
      drawRoundedRect(ctx, leftX, leftY, rectWidth, rectHeight, rx);

      // Right bar: rect at x=24, y=10.5, w=5, h=19
      const rightX = 24 * scale;
      const rightY = 10.5 * scale;
      drawRoundedRect(ctx, rightX, rightY, rectWidth, rectHeight, rx);

      // Center bridge: rect at x=14, y=17.5, w=12, h=5
      const bridgeX = 14 * scale;
      const bridgeY = 17.5 * scale;
      const bridgeW = 12 * scale;
      const bridgeH = 5 * scale;
      drawRoundedRect(ctx, bridgeX, bridgeY, bridgeW, bridgeH, rx);
      ctx.restore();

      // 3. Hover sweep scanning effect
      if (isHovered) {
        ctx.save();
        ctx.strokeStyle = '#00f5a0';
        ctx.lineWidth = 1.5 * scale;
        ctx.shadowColor = '#00f5a0';
        ctx.shadowBlur = 8 * scale;
        ctx.beginPath();
        // Draw horizontal sweep line across the H width
        ctx.moveTo(leftX, scanYRef.current);
        ctx.lineTo(rightX + rectWidth, scanYRef.current);
        ctx.stroke();
        ctx.restore();

        // Increment scan position
        scanYRef.current += size * 0.025;
        if (scanYRef.current > yBottom) {
          scanYRef.current = yTop;
        }

        // Spawn particles at scan sweep
        if (Math.random() < 0.4) {
          const particleCount = Math.floor(Math.random() * 2) + 1;
          for (let pIdx = 0; pIdx < particleCount; pIdx++) {
            particlesRef.current.push({
              x: leftX + Math.random() * (rightX + rectWidth - leftX),
              y: scanYRef.current,
              vx: (Math.random() - 0.5) * 1.5 * scale,
              vy: (Math.random() - 0.5) * 1.5 * scale,
              alpha: 1,
              size: Math.random() * 1.5 + 1.0,
            });
          }
        }
      }

      // 4. Update and draw active spark particles
      if (particlesRef.current.length > 0) {
        ctx.save();
        ctx.fillStyle = '#00d9f5';
        ctx.shadowColor = '#00d9f5';
        ctx.shadowBlur = 4 * scale;

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Move particles
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.035;

          // Remove dead particles
          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
          }
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isHovered, size]);

  return (
    <canvas
      ref={canvasRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`logo-mark cursor-pointer transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
