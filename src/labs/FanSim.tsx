import { useEffect, useRef } from 'react'

/**
 * Live Monte-Carlo canvas: stochastic paths keep tracing left to right, their
 * endpoints accumulate into a distribution histogram in real time, and a run
 * counter ticks up with every completed path. Pauses offscreen; renders a
 * single static frame under prefers-reduced-motion.
 */

const BUCKETS = 13
const PAD_Y = 12
const HIST_W = 64

interface Path {
  t: number
  duration: number
  targetY: number
  phase: number
  freq: number
  amp: number
  points: number[] // x,y pairs accumulated as the walk advances
}

interface Finished {
  points: number[]
  age: number
  color: string
}

interface Flash {
  y: number
  life: number
}

export function FanSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runsRef = useRef<HTMLSpanElement>(null)
  const p50Ref = useRef<HTMLSpanElement>(null)
  const bandRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio, 2)
    let W = 0
    let H = 0
    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const midY = () => H / 2
    const histX = () => W - HIST_W
    const x0 = 12

    // normal-ish sample via average of uniforms
    const sampleTarget = () => {
      const n = (Math.random() + Math.random() + Math.random() + Math.random()) / 4
      return PAD_Y + n * (H - PAD_Y * 2)
    }

    const ease = (t: number) => 1 - Math.pow(1 - t, 2.4)
    const counts = new Array(BUCKETS).fill(0)
    let total = 0
    const paths: Path[] = []
    const finished: Finished[] = []
    const flashes: Flash[] = []

    const spawn = (): Path => ({
      t: 0,
      duration: 1.05 + Math.random() * 0.9,
      targetY: sampleTarget(),
      phase: Math.random() * Math.PI * 2,
      freq: 5 + Math.random() * 5,
      amp: 4 + Math.random() * 9,
      points: [x0, midY()],
    })

    const strokePoints = (pts: number[]) => {
      ctx.beginPath()
      ctx.moveTo(pts[0], pts[1])
      for (let s = 2; s < pts.length; s += 2) ctx.lineTo(pts[s], pts[s + 1])
      ctx.stroke()
    }

    const yAt = (p: Path, t: number) => {
      const base = midY() + (p.targetY - midY()) * ease(t)
      const wiggle = Math.sin(t * p.freq + p.phase) * p.amp * (1 - t) * (t > 0.05 ? 1 : t / 0.05)
      return base + wiggle
    }

    const pathColor = (p: Path, alpha: number) => {
      const dev = Math.abs(p.targetY - midY()) / (H / 2 - PAD_Y)
      return dev < 0.45 ? `rgba(74, 222, 165, ${alpha})` : `rgba(34, 150, 170, ${alpha * 0.8})`
    }

    const drawBackdrop = () => {
      // confidence band across the simulation area
      const bandH = (H - PAD_Y * 2) * 0.42
      ctx.fillStyle = 'rgba(16, 185, 129, 0.045)'
      ctx.fillRect(x0, midY() - bandH / 2, histX() - 10 - x0, bandH)
      // dashed median guide
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.18)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 5])
      ctx.beginPath()
      ctx.moveTo(x0, midY())
      ctx.lineTo(histX() - 10, midY())
      ctx.stroke()
      ctx.setLineDash([])
      // time gridlines + ticks
      ctx.font = '8px ui-monospace, SFMono-Regular, monospace'
      ctx.fillStyle = 'rgba(148, 163, 184, 0.45)'
      const simW = histX() - 10 - x0
      for (let q = 1; q <= 3; q++) {
        const gx = x0 + (simW * q) / 4
        ctx.fillStyle = 'rgba(148, 163, 184, 0.08)'
        ctx.fillRect(gx, PAD_Y, 1, H - PAD_Y * 2)
      }
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.fillText('t+0', x0, H - 2)
      const horizonLabel = 'horizon'
      ctx.fillText(horizonLabel, histX() - 10 - ctx.measureText(horizonLabel).width, H - 2)
    }

    const percentileY = (frac: number) => {
      const sum = counts.reduce((a, b) => a + b, 0)
      if (sum === 0) return null
      const bh = (H - PAD_Y * 2) / BUCKETS
      let cum = 0
      for (let i = 0; i < BUCKETS; i++) {
        cum += counts[i]
        if (cum / sum >= frac) return PAD_Y + (i + 0.5) * bh
      }
      return PAD_Y + (BUCKETS - 0.5) * bh
    }

    const drawHistogram = () => {
      const bh = (H - PAD_Y * 2) / BUCKETS
      const max = Math.max(4, ...counts)
      for (let i = 0; i < BUCKETS; i++) {
        const w = (counts[i] / max) * (HIST_W - 30)
        const frac = counts[i] / max
        ctx.fillStyle = frac > 0.6 ? 'rgba(52, 211, 153, 0.85)' : 'rgba(52, 211, 153, 0.32)'
        ctx.beginPath()
        ctx.roundRect(histX() + 4, PAD_Y + i * bh + 1.5, Math.max(w, 1.5), bh - 3, 1.5)
        ctx.fill()
      }
      // separator hairline
      ctx.fillStyle = 'rgba(148, 163, 184, 0.14)'
      ctx.fillRect(histX() - 2, PAD_Y, 1, H - PAD_Y * 2)

      // live percentile labels + median marker, computed from the actual counts
      ctx.font = '8px ui-monospace, SFMono-Regular, monospace'
      const marks: [string, number][] = [
        ['p90', 0.1],
        ['p50', 0.5],
        ['p10', 0.9],
      ]
      for (const [label, frac] of marks) {
        const y = percentileY(frac)
        if (y === null) continue
        const isMedian = label === 'p50'
        ctx.fillStyle = isMedian ? 'rgba(110, 231, 183, 0.95)' : 'rgba(148, 163, 184, 0.55)'
        ctx.fillText(label, W - 22, y + 2.5)
        if (isMedian) {
          ctx.beginPath()
          ctx.moveTo(histX() - 7, y)
          ctx.lineTo(histX() - 2, y - 3)
          ctx.lineTo(histX() - 2, y + 3)
          ctx.closePath()
          ctx.fill()
        }
      }
    }

    const drawInput = () => {
      const g = ctx.createRadialGradient(x0, midY(), 0, x0, midY(), 9)
      g.addColorStop(0, 'rgba(167, 243, 208, 0.55)')
      g.addColorStop(1, 'rgba(167, 243, 208, 0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x0, midY(), 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#a7f3d0'
      ctx.beginPath()
      ctx.arc(x0, midY(), 2.6, 0, Math.PI * 2)
      ctx.fill()
    }

    const bucketFor = (y: number) =>
      Math.min(BUCKETS - 1, Math.max(0, Math.floor(((y - PAD_Y) / (H - PAD_Y * 2)) * BUCKETS)))

    // live readouts derived from the actual distribution
    const updateStats = () => {
      const yMid = percentileY(0.5)
      const yHi = percentileY(0.1)
      const yLo = percentileY(0.9)
      if (yMid === null || yHi === null || yLo === null) return
      const span = H - PAD_Y * 2
      const score = 1 - (yMid - PAD_Y) / span
      const band = Math.abs(yLo - yHi) / span
      if (p50Ref.current) p50Ref.current.textContent = score.toFixed(2)
      if (bandRef.current) bandRef.current.textContent = band.toFixed(2)
    }

    // ── static frame for reduced motion ──────────────────────
    if (reduce) {
      ctx.clearRect(0, 0, W, H)
      drawBackdrop()
      for (let i = 0; i < 16; i++) {
        const p = spawn()
        ctx.strokeStyle = pathColor(p, 0.5)
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let s = 0; s <= 40; s++) {
          const t = s / 40
          const x = x0 + (histX() - 8 - x0) * t
          const y = yAt(p, t)
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        counts[bucketFor(p.targetY)]++
      }
      drawHistogram()
      drawInput()
      if (runsRef.current) runsRef.current.textContent = '10k+'
      updateStats()
      return () => window.removeEventListener('resize', resize)
    }

    // ── live loop, paused while offscreen ────────────────────
    let frame = 0
    let running = false
    let last = 0
    let spawnTimer = 0
    let statsTimer = 0

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
      last = now
      ctx.clearRect(0, 0, W, H)
      drawBackdrop()

      spawnTimer -= dt
      if (spawnTimer <= 0 && paths.length < 5) {
        paths.push(spawn())
        spawnTimer = 0.2 + Math.random() * 0.2
      }

      // completed traces linger for a few seconds, fading by age
      ctx.lineWidth = 1
      for (let i = finished.length - 1; i >= 0; i--) {
        const f = finished[i]
        f.age += dt
        if (f.age > 5.5 || finished.length - i > 14) {
          finished.splice(i, 1)
          continue
        }
        ctx.globalAlpha = Math.max(0, 1 - f.age / 5.5) * 0.45
        ctx.strokeStyle = f.color
        strokePoints(f.points)
      }
      ctx.globalAlpha = 1

      // active walks redraw their full trace each frame, plus a glowing head
      for (let i = paths.length - 1; i >= 0; i--) {
        const p = paths[i]
        p.t = Math.min(1, p.t + dt / p.duration)
        const x = x0 + (histX() - 8 - x0) * p.t
        const y = yAt(p, p.t)
        p.points.push(x, y)

        ctx.strokeStyle = pathColor(p, 0.9)
        ctx.lineWidth = 1.4
        strokePoints(p.points)

        ctx.save()
        ctx.shadowColor = 'rgba(110, 231, 183, 0.9)'
        ctx.shadowBlur = 7
        ctx.fillStyle = '#a7f3d0'
        ctx.beginPath()
        ctx.arc(x, y, 1.7, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        if (p.t >= 1) {
          counts[bucketFor(y)]++
          total++
          flashes.push({ y, life: 1 })
          finished.push({ points: p.points, age: 0, color: pathColor(p, 1) })
          if (runsRef.current) runsRef.current.textContent = String(total).padStart(4, '0')
          paths.splice(i, 1)
        }
      }

      // endpoint flashes
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i]
        f.life -= dt * 2.2
        if (f.life <= 0) {
          flashes.splice(i, 1)
          continue
        }
        ctx.fillStyle = `rgba(167, 243, 208, ${f.life * 0.5})`
        ctx.beginPath()
        ctx.arc(histX() - 8, f.y, (1 - f.life) * 7 + 2, 0, Math.PI * 2)
        ctx.fill()
      }

      drawHistogram()
      drawInput()

      statsTimer -= dt
      if (statsTimer <= 0) {
        updateStats()
        statsTimer = 0.3
      }
      frame = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true
        last = performance.now()
        frame = requestAnimationFrame(tick)
      } else if (!entry.isIntersecting && running) {
        running = false
        cancelAnimationFrame(frame)
      }
    })
    io.observe(canvas)

    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-slate-500">
          monte carlo
        </span>
        <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-emerald-400/90 inline-flex items-center gap-1.5">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          runs <span ref={runsRef}>0000</span>
        </span>
      </div>
      <canvas ref={canvasRef} className="w-full h-[130px] block" />

      {/* live readouts fed by the simulation above */}
      <div className="mt-2.5 grid grid-cols-3 gap-2">
        <div className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5">
          <div className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-slate-500">p50 outcome</div>
          <div className="font-mono text-[12.5px] text-emerald-300 mt-0.5">
            <span ref={p50Ref}>0.50</span>
          </div>
        </div>
        <div className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5">
          <div className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-slate-500">p10-p90 band</div>
          <div className="font-mono text-[12.5px] text-emerald-300 mt-0.5">
            <span ref={bandRef}>0.00</span>
          </div>
        </div>
        <div className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5">
          <div className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-slate-500">analyst agents</div>
          <div className="flex items-center gap-1.5 mt-[7px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
