import { useEffect, useRef } from 'react'

/**
 * Surveillance-monitor canvas: a radar beam sweeps the left dial and discovers
 * targets — each flares with a targeting reticle and hex id, links into the
 * entity graph, and pushes an intercept line onto the feed at right. A thin
 * instrument strip along the bottom carries the live readouts (bearing,
 * sources, entities, confidence), and viewfinder brackets frame the scene.
 * Everything is drawn in-canvas — no header row or stat grid — so the card
 * reads as one instrument rather than the chart template the other labs use.
 * Pauses offscreen; renders a single static frame under prefers-reduced-motion.
 */

const SWEEP_PERIOD = 4.2 // seconds per revolution
const TRAIL = Math.PI * 0.9 // beam afterglow arc
const TWO_PI = Math.PI * 2
const STRIP_H = 20 // bottom instrument strip
const FEED_X = 162 // feed column start
const ROW_H = 14

interface Target {
  angle: number
  dist: number // fraction of radius
  discovered: boolean
  flare: number // 1 → 0 right after discovery
  life: number // seconds remaining before it fades and respawns
  id: string
}

interface FeedRow {
  text: string
  age: number
  hot: boolean // discovery rows render brighter than ambient chatter
}

const SRC = ['web', 'social', 'dns', 'whois', 'geo', 'docs', 'forum', 'cert']
const ACT = [
  'alias matched',
  'domain pivot',
  'geotag fixed',
  'entity linked',
  'cert reuse',
  'handle reuse',
  'exif parsed',
  'node merged',
]

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
const hexId = () =>
  Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0').toUpperCase()

export function OsintScan({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    const cx = 76
    const cy = () => (H - STRIP_H) / 2
    const R = () => (H - STRIP_H) / 2 - 11
    const mono = (px: number) => `${px}px ui-monospace, SFMono-Regular, monospace`

    const spawnTarget = (): Target => ({
      angle: Math.random() * TWO_PI,
      dist: 0.28 + Math.random() * 0.6,
      discovered: false,
      flare: 0,
      life: 0,
      id: hexId(),
    })
    const targets: Target[] = Array.from({ length: 7 }, spawnTarget)
    const feed: FeedRow[] = []
    let theta = -Math.PI / 2
    let hits = 0
    let conf = 0.91
    let sources = 7

    const targetXY = (t: Target) => ({
      x: cx + Math.cos(t.angle) * R() * t.dist,
      y: cy() + Math.sin(t.angle) * R() * t.dist,
    })

    // fade-in on discovery, fade-out at end of life
    const visibility = (t: Target) =>
      !t.discovered ? 0 : Math.min(1, t.life / 1.5) * Math.min(1, (1 - t.flare) * 3 + 0.25)

    const pushFeed = (text: string, hot: boolean) => {
      feed.unshift({ text, age: 0, hot })
      const max = Math.floor((H - STRIP_H - 28) / ROW_H)
      if (feed.length > max) feed.length = max
    }

    const drawFrame = () => {
      // viewfinder brackets on the scene corners
      const l = 10
      const m = 2
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (const [px, py, dx, dy] of [
        [m, m, 1, 1],
        [W - m, m, -1, 1],
        [W - m, H - m, -1, -1],
        [m, H - m, 1, -1],
      ] as const) {
        ctx.moveTo(px, py + dy * l)
        ctx.lineTo(px, py)
        ctx.lineTo(px + dx * l, py)
      }
      ctx.stroke()
    }

    const drawDial = () => {
      const r = R()
      const y = cy()
      ctx.lineWidth = 1
      for (const f of [1, 0.62, 0.3]) {
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 + f * 0.15})`
        ctx.beginPath()
        ctx.arc(cx, y, r * f, 0, TWO_PI)
        ctx.stroke()
      }
      // crosshair
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)'
      ctx.beginPath()
      ctx.moveTo(cx - r, y)
      ctx.lineTo(cx + r, y)
      ctx.moveTo(cx, y - r)
      ctx.lineTo(cx, y + r)
      ctx.stroke()
      // graduation: fine tick every 6°, long tick every 30°
      for (let i = 0; i < 60; i++) {
        const a = (i / 60) * TWO_PI
        const major = i % 5 === 0
        const len = major ? 4 : 2
        ctx.strokeStyle = `rgba(110, 231, 183, ${major ? 0.45 : 0.18})`
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * r, y + Math.sin(a) * r)
        ctx.lineTo(cx + Math.cos(a) * (r - len), y + Math.sin(a) * (r - len))
        ctx.stroke()
      }
      // cardinal bearings
      ctx.font = mono(6.5)
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(148, 163, 184, 0.45)'
      ctx.fillText('000', cx, y - r + 12)
      ctx.fillText('090', cx + r - 13, y + 2)
      ctx.fillText('180', cx, y + r - 7)
      ctx.fillText('270', cx - r + 13, y + 2)
      ctx.textAlign = 'left'
    }

    const drawBeam = () => {
      const r = R()
      const y = cy()
      // afterglow: thin arcs stacked behind the beam edge, alpha decaying
      const SEGS = 36
      for (let i = 0; i < SEGS; i++) {
        const a0 = theta - (TRAIL * (i + 1)) / SEGS
        const a1 = theta - (TRAIL * i) / SEGS
        ctx.fillStyle = `rgba(52, 211, 153, ${0.16 * (1 - i / SEGS)})`
        ctx.beginPath()
        ctx.moveTo(cx, y)
        ctx.arc(cx, y, r, a0, a1)
        ctx.closePath()
        ctx.fill()
      }
      // leading edge + glowing head on the rim
      ctx.strokeStyle = 'rgba(167, 243, 208, 0.9)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(cx, y)
      ctx.lineTo(cx + Math.cos(theta) * r, y + Math.sin(theta) * r)
      ctx.stroke()
      ctx.save()
      ctx.shadowColor = 'rgba(110, 231, 183, 0.9)'
      ctx.shadowBlur = 7
      ctx.fillStyle = '#a7f3d0'
      ctx.beginPath()
      ctx.arc(cx + Math.cos(theta) * r, y + Math.sin(theta) * r, 1.8, 0, TWO_PI)
      ctx.fill()
      ctx.restore()
    }

    const drawLinks = () => {
      // each discovered node links to its nearest discovered peer
      const vis = targets.filter((t) => visibility(t) > 0.05)
      for (const t of vis) {
        let best: Target | null = null
        let bestD = Infinity
        const a = targetXY(t)
        for (const o of vis) {
          if (o === t) continue
          const b = targetXY(o)
          const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2
          if (d < bestD) {
            bestD = d
            best = o
          }
        }
        if (!best) continue
        const b = targetXY(best)
        const alpha = 0.16 * Math.min(visibility(t), visibility(best)) + t.flare * 0.25
        ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`
        ctx.lineWidth = 1
        ctx.setLineDash([2, 3])
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }

    const drawTargets = () => {
      for (const t of targets) {
        const v = visibility(t)
        if (v <= 0.02) continue
        const { x, y } = targetXY(t)
        // expanding ping right after discovery
        if (t.flare > 0.02) {
          ctx.strokeStyle = `rgba(167, 243, 208, ${t.flare * 0.55})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(x, y, (1 - t.flare) * 15 + 3, 0, TWO_PI)
          ctx.stroke()
        }
        // targeting reticle: four corner brackets
        const s = 5.5
        const l = 2.6
        ctx.strokeStyle = `rgba(110, 231, 183, ${v * 0.65})`
        ctx.lineWidth = 1
        ctx.beginPath()
        for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
          ctx.moveTo(x + dx * s, y + dy * (s - l))
          ctx.lineTo(x + dx * s, y + dy * s)
          ctx.lineTo(x + dx * (s - l), y + dy * s)
        }
        ctx.stroke()
        // hex id tag beside the contact
        ctx.font = mono(6.5)
        ctx.fillStyle = `rgba(167, 243, 208, ${v * 0.7})`
        ctx.fillText(t.id, x + 8, y - 6)
        // the contact itself
        ctx.save()
        ctx.shadowColor = 'rgba(110, 231, 183, 0.8)'
        ctx.shadowBlur = t.flare * 8 + 3
        ctx.fillStyle = `rgba(167, 243, 208, ${0.4 + v * 0.6})`
        ctx.beginPath()
        ctx.arc(x, y, 1.9, 0, TWO_PI)
        ctx.fill()
        ctx.restore()
      }
    }

    const drawFeed = (now: number) => {
      const x = FEED_X
      const maxW = W - x - 10
      if (maxW < 40) return
      // column header + count
      ctx.font = mono(8)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)'
      ctx.fillText('INTERCEPT FEED', x, 14)
      ctx.textAlign = 'right'
      ctx.fillStyle = 'rgba(110, 231, 183, 0.9)'
      ctx.fillText(String(hits).padStart(4, '0'), W - 10, 14)
      ctx.textAlign = 'left'
      ctx.fillStyle = 'rgba(148, 163, 184, 0.16)'
      ctx.fillRect(x, 19, maxW, 1)

      ctx.font = mono(8.5)
      for (let i = 0; i < feed.length; i++) {
        const row = feed[i]
        const slide = Math.min(1, row.age * 5)
        const alpha = Math.max(0.1, (row.hot ? 0.92 : 0.5) - i * 0.1) * slide
        ctx.fillStyle = row.hot
          ? `rgba(110, 231, 183, ${alpha})`
          : `rgba(148, 163, 184, ${alpha})`
        const prefix = row.hot ? '▸ ' : '· '
        ctx.fillText(prefix + row.text, x + (1 - slide) * 6, 30 + i * ROW_H, maxW)
      }
      // blinking cursor under the newest row
      if (now % 1 < 0.55) {
        ctx.fillStyle = 'rgba(110, 231, 183, 0.85)'
        ctx.fillRect(x, 30 + feed.length * ROW_H - 7, 4, 8)
      }
    }

    const drawStrip = (now: number) => {
      const y = H - STRIP_H
      ctx.fillStyle = 'rgba(148, 163, 184, 0.14)'
      ctx.fillRect(6, y, W - 12, 1)
      const ty = y + 13
      ctx.font = mono(8)
      // live dot
      if (now % 1.2 < 0.7) {
        ctx.fillStyle = 'rgba(52, 211, 153, 0.95)'
        ctx.beginPath()
        ctx.arc(11, ty - 3, 2, 0, TWO_PI)
        ctx.fill()
      }
      // bearing readout follows the beam
      const az = Math.round((((theta + Math.PI / 2) % TWO_PI) + TWO_PI) % TWO_PI * (180 / Math.PI))
      ctx.fillStyle = 'rgba(167, 243, 208, 0.85)'
      ctx.fillText(`AZ ${String(az).padStart(3, '0')}°`, 18, ty)
      // readouts, right-aligned
      const ent = targets.filter((t) => visibility(t) > 0.05).length
      ctx.textAlign = 'right'
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)'
      ctx.fillText(
        `SRC ${String(sources).padStart(2, '0')} · ENT ${String(ent).padStart(2, '0')} · CONF ${conf.toFixed(2)}`,
        W - 10,
        ty,
      )
      ctx.textAlign = 'left'
    }

    const discover = (t: Target) => {
      t.discovered = true
      t.flare = 1
      t.life = 5 + Math.random() * 4
      hits++
      conf = Math.min(0.98, Math.max(0.78, conf + (Math.random() - 0.48) * 0.05))
      pushFeed(`${t.id} ${pick(SRC)} · ${pick(ACT)} · ${conf.toFixed(2)}`, true)
    }

    const drawScene = (now: number) => {
      ctx.clearRect(0, 0, W, H)
      drawFrame()
      drawDial()
      drawBeam()
      drawLinks()
      drawTargets()
      drawFeed(now)
      drawStrip(now)
    }

    // ── static frame for reduced motion ──────────────────────
    if (reduce) {
      theta = Math.PI / 6
      hits = 2417
      for (const t of targets.slice(0, 5)) {
        t.discovered = true
        t.flare = 0
        t.life = 5
        pushFeed(`${t.id} ${pick(SRC)} · ${pick(ACT)} · 0.${88 + Math.floor(Math.random() * 10)}`, true)
      }
      for (const row of feed) row.age = 1
      drawScene(0.1)
      return () => window.removeEventListener('resize', resize)
    }

    // ── live loop, paused while offscreen ────────────────────
    let frame = 0
    let running = false
    let last = 0
    let chatterTimer = 1
    let sourcesTimer = 2

    const tick = (nowMs: number) => {
      const now = nowMs / 1000
      const dt = Math.min(0.05, now - last || 0.016)
      last = now

      const prev = theta
      theta += (dt / SWEEP_PERIOD) * TWO_PI

      for (const t of targets) {
        t.flare = Math.max(0, t.flare - dt * 1.6)
        if (t.discovered) {
          t.life -= dt
          if (t.life <= 0) Object.assign(t, spawnTarget())
        } else {
          // crossed when the beam swept past the target's bearing this frame
          const delta = (t.angle - prev + TWO_PI * 4) % TWO_PI
          if (delta <= theta - prev) discover(t)
        }
      }

      chatterTimer -= dt
      if (chatterTimer <= 0) {
        pushFeed(`scan ${pick(SRC)} · ${120 + Math.floor(Math.random() * 870)} records`, false)
        chatterTimer = 1.4 + Math.random() * 1.8
      }
      sourcesTimer -= dt
      if (sourcesTimer <= 0) {
        sources = 6 + Math.floor(Math.random() * 3)
        sourcesTimer = 1.5 + Math.random() * 2
      }
      for (const row of feed) row.age += dt

      drawScene(now)
      frame = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true
        last = performance.now() / 1000
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
      <canvas ref={canvasRef} className="w-full h-[185px] block" aria-hidden="true" />
    </div>
  )
}
