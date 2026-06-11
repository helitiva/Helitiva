import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  spawnX: number;
  spawnY: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  c: number[];
  alpha: number;
  angleX: number;
  angleY: number;
  speedX: number;
  speedY: number;
  amp: number;
}

export const ParticlesBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prefers reduced motion check
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = [
      [16, 185, 129],   // Emerald
      [129, 140, 248],  // Indigo
      [34, 211, 238],   // Cyan
      [232, 121, 249],  // Fuchsia
    ];

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };

    const isMobile = () => window.innerWidth < 768;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = isMobile() ? 15000 : 8000;
      const count = Math.min(120, Math.floor((w * h) / density));
      particles = [];

      for (let i = 0; i < count; i++) {
        const c = palette[i % palette.length];
        const size = Math.random() * 4 + 2.5; // radius between 2.5px and 6.5px
        const x = Math.random() * w;
        const y = Math.random() * h;
        particles.push({
          x: x,
          y: y,
          spawnX: x,
          spawnY: y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: size,
          c: c,
          alpha: Math.random() * 0.35 + 0.15, // opacity between 0.15 and 0.50
          angleX: Math.random() * Math.PI * 2,
          angleY: Math.random() * Math.PI * 2,
          speedX: Math.random() * 0.01 + 0.002,
          speedY: Math.random() * 0.01 + 0.002,
          amp: Math.random() * 12 + 6 // wave amplitude
        });
      }
    };

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Move base position slowly
        p.spawnX += p.vx;
        p.spawnY += p.vy;

        // Wrap around screen boundaries
        if (p.spawnX < -20) p.spawnX = w + 20;
        if (p.spawnX > w + 20) p.spawnX = -20;
        if (p.spawnY < -20) p.spawnY = h + 20;
        if (p.spawnY > h + 20) p.spawnY = -20;

        // Return force to spawn point (elastic link)
        p.baseX += (p.spawnX - p.baseX) * 0.03;
        p.baseY += (p.spawnY - p.baseY) * 0.03;

        // 2. Mouse push (repulsion)
        if (mouse.x !== -9999) {
          const dx = p.baseX - mouse.x;
          const dy = p.baseY - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            const force = (130 - dist) / 130;
            // Push baseX/baseY away from mouse
            p.baseX += (dx / (dist || 1)) * force * 3;
            p.baseY += (dy / (dist || 1)) * force * 3;
          }
        }

        // 3. Update wave animation
        p.angleX += p.speedX;
        p.angleY += p.speedY;

        p.x = p.baseX + Math.sin(p.angleX) * p.amp;
        p.y = p.baseY + Math.cos(p.angleY) * p.amp;

        // 4. Draw soft glowing particle
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(${p.c[0]}, ${p.c[1]}, ${p.c[2]}, ${p.alpha})`);
        grad.addColorStop(1, `rgba(${p.c[0]}, ${p.c[1]}, ${p.c[2]}, 0)`);

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handlePointerOut = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut);

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
