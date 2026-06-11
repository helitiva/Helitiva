import { useEffect, useRef } from 'react'

/**
 * Ops pipeline canvas: ticket chips ride a dashed conveyor through three
 * agent stations (triage → execute → verify). Each station holds the chip
 * while a progress ring completes around it; verify occasionally kicks one
 * back to execute along an overhead arc (a retry, tinted amber) before it
 * finally shrinks into the done stack at right and the counter ticks up.
 * Chips leave motion trails, stations flash a ping when they release work,
 * and every close floats a +1 off the stack — kinetic and nearly wordless,
 * deliberately unlike the chart and feed layouts on the other lab cards.
 * Pauses offscreen; renders a static mid-shift frame under
 * prefers-reduced-motion.
 */

const TWO_PI = Math.PI * 2
const STATIONS = ['triage', 'execute', 'verify']
const RETRY_RATE = 0.14
const MAX_ACTIVE = 3
const STACK_MAX = 7

type Phase = 'move' | 'process' | 'retry' | 'exit'

interface Ticket {
  phase: Phase
  station: number // station being approached or processed
  fromX: number
  t: number // seconds into the current phase
  dur: number
  retried: boolean
  teal: boolean // minority of chips run in the teal family for variety
  id: string
}

interface Ghost {
  x: number
  y: number
  a: number
  amber: boolean
}

interface Ping {
  x: number
  y: number
  life: number
  amber: boolean
}

const easeInOut = (t: number) => t * t * (3 - 2 * t)
const newId = () => String(Math.floor(Math.random() * 9000) + 1000)

export function AgentOps({ className }: { className?: string }) {
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

    const beltY = () => H * 0.58
    const queueX = 18
    const stationX = (i: number) => W * (0.24 + i * 0.21)
    const stackX = () => W - 38
    const mono = (px: number) => `${px}px ui-monospace, SFMono-Regular, monospace`

    const chipHue = (tk: Ticket, alpha: number) =>
      tk.retried
        ? `rgba(251, 191, 36, ${alpha})`
        : tk.teal
          ? `rgba(45, 212, 191, ${alpha})`
          : `rgba(110, 231, 183, ${alpha})`

    const tickets: Ticket[] = []
    const ghosts: Ghost[] = []
    const pings: Ping[] = []
    let closed = 1280 + Math.floor(Math.random() * 60)
    let retries = Math.floor(closed * 0.03)
    let stack = 4
    let stackPop = 0
    let plusOne = 0 // floating "+1" life
    let dashShift = 0
    let spawnTimer = 0.4

    const spawn = () => {
      tickets.push({
        phase: 'move',
        station: 0,
        fromX: queueX,
        t: 0,
        dur: Math.abs(stationX(0) - queueX) / 80,
        retried: false,
        teal: Math.random() < 0.3,
        id: newId(),
      })
    }

    const ticketX = (tk: Ticket) => {
      if (tk.phase === 'process') return stationX(tk.station)
      const k = easeInOut(Math.min(1, tk.t / tk.dur))
      if (tk.phase === 'move') return tk.fromX + (stationX(tk.station) - tk.fromX) * k
      if (tk.phase === 'retry') return tk.fromX + (stationX(1) - tk.fromX) * k
      return tk.fromX + (stackX() - tk.fromX) * k // exit
    }

    const ticketY = (tk: Ticket) => {
      const k = easeInOut(Math.min(1, tk.t / tk.dur))
      // retry rides an overhead arc back to execute; exit dips into the stack
      if (tk.phase === 'retry') return beltY() - Math.sin(k * Math.PI) * 26
      if (tk.phase === 'exit') return beltY() - Math.sin(k * Math.PI) * 18
      return beltY()
    }

    const drawGrid = () => {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.07)'
      for (let gx = 12; gx < W - 6; gx += 22) {
        for (let gy = 16; gy < H - 10; gy += 22) {
          ctx.fillRect(gx, gy, 1, 1)
        }
      }
    }

    const drawBelt = (now: number) => {
      const y = beltY()
      // shadow rail under the live belt
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(6, y + 3)
      ctx.lineTo(W - 6, y + 3)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)'
      ctx.setLineDash([5, 6])
      ctx.lineDashOffset = -dashShift
      ctx.beginPath()
      ctx.moveTo(6, y)
      ctx.lineTo(W - 6, y)
      ctx.stroke()
      ctx.setLineDash([])
      // inbound chute: bracket + chips breathing while they wait
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.3)'
      ctx.beginPath()
      ctx.moveTo(4, y - 10)
      ctx.lineTo(1, y - 10)
      ctx.lineTo(1, y + 10)
      ctx.lineTo(4, y + 10)
      ctx.stroke()
      for (let i = 0; i < 2; i++) {
        const breathe = 0.28 + Math.sin(now * 2 + i * 1.4) * 0.08 - i * 0.1
        ctx.strokeStyle = `rgba(110, 231, 183, ${breathe})`
        ctx.strokeRect(queueX - 6 - i * 10, y - 4, 8, 8)
      }
    }

    const drawStations = (now: number) => {
      const y = beltY()
      ctx.font = mono(7)
      ctx.textAlign = 'center'
      for (let i = 0; i < STATIONS.length; i++) {
        const x = stationX(i)
        const busy = tickets.some((tk) => tk.phase === 'process' && tk.station === i)
        const r = busy ? 7.5 + Math.sin(now * 6) * 0.7 : 6.5
        const gy = y - 9
        ctx.strokeStyle = `rgba(52, 211, 153, ${busy ? 0.9 : 0.35})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, gy - r)
        ctx.lineTo(x + r, gy)
        ctx.lineTo(x, gy + r)
        ctx.lineTo(x - r, gy)
        ctx.closePath()
        ctx.stroke()
        if (busy) {
          // working: spinning arc segments orbit the gate
          ctx.strokeStyle = 'rgba(167, 243, 208, 0.5)'
          for (let s = 0; s < 3; s++) {
            const a = now * 2.4 + (s * TWO_PI) / 3
            ctx.beginPath()
            ctx.arc(x, gy, 12, a, a + 0.7)
            ctx.stroke()
          }
          ctx.fillStyle = 'rgba(167, 243, 208, 0.9)'
          ctx.beginPath()
          ctx.arc(x, gy, 1.3, 0, TWO_PI)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(148, 163, 184, ${busy ? 0.85 : 0.45})`
        ctx.fillText(STATIONS[i], x, y + 18)
      }
      ctx.textAlign = 'left'
    }

    const drawStack = () => {
      const x = stackX()
      const y = beltY()
      for (let i = 0; i < stack; i++) {
        const pop = i === stack - 1 ? stackPop : 0
        const top = i === stack - 1
        ctx.fillStyle = `rgba(52, 211, 153, ${0.3 + (i / STACK_MAX) * 0.45 + pop * 0.3})`
        if (top && pop > 0.05) {
          ctx.save()
          ctx.shadowColor = 'rgba(110, 231, 183, 0.8)'
          ctx.shadowBlur = pop * 9
        }
        ctx.beginPath()
        ctx.roundRect(x - 9 - pop * 1.5, y - 6 - i * 5.5, 18 + pop * 3, 3.5, 1.5)
        ctx.fill()
        if (top && pop > 0.05) ctx.restore()
      }
      if (plusOne > 0.02) {
        ctx.font = mono(8)
        ctx.textAlign = 'center'
        ctx.fillStyle = `rgba(167, 243, 208, ${plusOne * 0.9})`
        ctx.fillText('+1', x, y - 10 - stack * 5.5 - (1 - plusOne) * 12)
        ctx.textAlign = 'left'
      }
      ctx.font = mono(8)
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(110, 231, 183, 0.85)'
      ctx.fillText(closed.toLocaleString('en-US'), x, y + 18)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.45)'
      ctx.font = mono(6.5)
      ctx.fillText('closed', x, y + 28)
      ctx.textAlign = 'left'
    }

    const drawHud = (now: number) => {
      ctx.font = mono(8)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.fillText(`retry ${((retries / closed) * 100).toFixed(1)}%`, 8, 13)
      ctx.textAlign = 'right'
      ctx.fillStyle = 'rgba(110, 231, 183, 0.75)'
      ctx.fillText('24/7', W - 8, 13)
      ctx.textAlign = 'left'
      if (now % 1.2 < 0.7) {
        ctx.fillStyle = 'rgba(52, 211, 153, 0.95)'
        ctx.beginPath()
        ctx.arc(W - 34, 10, 2, 0, TWO_PI)
        ctx.fill()
      }
    }

    const drawRetryPath = () => {
      // ghost of the overhead return lane while a chip rides it
      if (!tickets.some((tk) => tk.phase === 'retry')) return
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.18)'
      ctx.lineWidth = 1
      ctx.setLineDash([2, 4])
      ctx.beginPath()
      ctx.moveTo(stationX(2), beltY() - 4)
      ctx.quadraticCurveTo((stationX(1) + stationX(2)) / 2, beltY() - 36, stationX(1), beltY() - 4)
      ctx.stroke()
      ctx.setLineDash([])
    }

    const drawGhosts = () => {
      for (const g of ghosts) {
        ctx.fillStyle = g.amber
          ? `rgba(251, 191, 36, ${g.a * 0.16})`
          : `rgba(52, 211, 153, ${g.a * 0.16})`
        ctx.beginPath()
        ctx.roundRect(g.x - 6, g.y - 4.5, 12, 9, 2)
        ctx.fill()
      }
    }

    const drawPings = () => {
      for (const p of pings) {
        const tint = p.amber ? '251, 191, 36' : '167, 243, 208'
        ctx.strokeStyle = `rgba(${tint}, ${p.life * 0.55})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(p.x, p.y, (1 - p.life) * 14 + 4, 0, TWO_PI)
        ctx.stroke()
        // four rays
        const rr = (1 - p.life) * 10 + 8
        ctx.strokeStyle = `rgba(${tint}, ${p.life * 0.4})`
        ctx.beginPath()
        for (let q = 0; q < 4; q++) {
          const a = Math.PI / 4 + (q * Math.PI) / 2
          ctx.moveTo(p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr)
          ctx.lineTo(p.x + Math.cos(a) * (rr + 3), p.y + Math.sin(a) * (rr + 3))
        }
        ctx.stroke()
      }
    }

    const drawTicket = (tk: Ticket) => {
      const x = ticketX(tk)
      const y = ticketY(tk)
      const exitK = tk.phase === 'exit' ? easeInOut(Math.min(1, tk.t / tk.dur)) : 0
      // fresh chips pop in off the chute
      const popK =
        tk.phase === 'move' && tk.station === 0 && tk.fromX === queueX
          ? Math.min(1, tk.t * 6)
          : 1
      const scale = (1 - exitK * 0.65) * (0.5 + popK * 0.5)
      const w = 13 * scale
      const h = 10 * scale

      ctx.save()
      ctx.shadowColor = tk.retried ? 'rgba(251, 191, 36, 0.5)' : 'rgba(52, 211, 153, 0.6)'
      ctx.shadowBlur = tk.phase === 'process' ? 9 : 4
      ctx.fillStyle = chipHue(tk, 0.13)
      ctx.strokeStyle = chipHue(tk, 0.85 - exitK * 0.5)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(x - w / 2, y - h / 2, w, h, 2)
      ctx.fill()
      ctx.stroke()
      ctx.restore()

      // ticket "text" lines inside the chip
      if (scale > 0.85) {
        ctx.fillStyle = chipHue(tk, 0.5)
        ctx.fillRect(x - w / 2 + 2.5, y - 1.5, w - 7, 1)
        ctx.fillRect(x - w / 2 + 2.5, y + 1.5, w - 9.5, 1)
      }

      // id tag riding above the chip
      if (exitK < 0.4 && popK > 0.8) {
        ctx.font = mono(6.5)
        ctx.textAlign = 'center'
        ctx.fillStyle = `rgba(148, 163, 184, ${0.55 - exitK})`
        ctx.fillText(`#${tk.id}`, x, y - 11)
        ctx.textAlign = 'left'
      }

      // progress ring while a station works the ticket
      if (tk.phase === 'process') {
        const frac = Math.min(1, tk.t / tk.dur)
        ctx.strokeStyle = tk.retried ? 'rgba(251, 191, 36, 0.85)' : 'rgba(167, 243, 208, 0.9)'
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.arc(x, y, 10.5, -Math.PI / 2, -Math.PI / 2 + frac * TWO_PI)
        ctx.stroke()
      }
    }

    const advance = (tk: Ticket, dt: number): boolean => {
      tk.t += dt
      if (tk.t < tk.dur) return true

      if (tk.phase === 'move') {
        tk.phase = 'process'
        tk.t = 0
        tk.dur = 0.8 + Math.random() * 0.9
        return true
      }
      if (tk.phase === 'process') {
        pings.push({ x: ticketX(tk), y: ticketY(tk), life: 1, amber: false })
        if (tk.station < 2) {
          tk.phase = 'move'
          tk.fromX = stationX(tk.station)
          tk.station++
          tk.t = 0
          tk.dur = Math.abs(stationX(tk.station) - tk.fromX) / 80
          return true
        }
        // verify done: occasionally bounce back to execute, once
        if (!tk.retried && Math.random() < RETRY_RATE) {
          tk.phase = 'retry'
          tk.retried = true
          retries++
          pings[pings.length - 1].amber = true
          tk.fromX = stationX(2)
          tk.t = 0
          tk.dur = 0.9
          return true
        }
        tk.phase = 'exit'
        tk.fromX = stationX(2)
        tk.t = 0
        tk.dur = 0.55
        return true
      }
      if (tk.phase === 'retry') {
        tk.phase = 'process'
        tk.station = 1
        tk.t = 0
        tk.dur = 0.6 + Math.random() * 0.5
        return true
      }
      // exit complete: bank it
      closed++
      stackPop = 1
      plusOne = 1
      stack = stack >= STACK_MAX ? 3 : stack + 1
      return false
    }

    const drawScene = (now: number) => {
      ctx.clearRect(0, 0, W, H)
      drawGrid()
      drawBelt(now)
      drawRetryPath()
      drawGhosts()
      drawStations(now)
      drawStack()
      drawHud(now)
      drawPings()
      for (const tk of tickets) drawTicket(tk)
    }

    // ── static frame for reduced motion ──────────────────────
    if (reduce) {
      tickets.push(
        { phase: 'process', station: 0, fromX: 0, t: 0.5, dur: 1, retried: false, teal: false, id: newId() },
        { phase: 'move', station: 2, fromX: stationX(1), t: 0.4, dur: 1, retried: false, teal: true, id: newId() },
      )
      drawScene(0.3)
      return () => window.removeEventListener('resize', resize)
    }

    // ── live loop, paused while offscreen ────────────────────
    let frame = 0
    let running = false
    let last = 0
    let elapsed = 0

    const tick = (nowMs: number) => {
      const now = nowMs / 1000
      const dt = Math.min(0.05, now - last || 0.016)
      last = now
      elapsed += dt
      dashShift += dt * 14
      stackPop = Math.max(0, stackPop - dt * 3)
      plusOne = Math.max(0, plusOne - dt * 1.4)

      spawnTimer -= dt
      if (spawnTimer <= 0 && tickets.length < MAX_ACTIVE) {
        spawn()
        spawnTimer = 2 + Math.random() * 1.6
      }

      for (let i = tickets.length - 1; i >= 0; i--) {
        const tk = tickets[i]
        // moving chips shed a fading trail
        if (tk.phase !== 'process') {
          ghosts.push({ x: ticketX(tk), y: ticketY(tk), a: 1, amber: tk.retried })
        }
        if (!advance(tk, dt)) tickets.splice(i, 1)
      }

      for (let i = ghosts.length - 1; i >= 0; i--) {
        ghosts[i].a -= dt * 3.2
        if (ghosts[i].a <= 0) ghosts.splice(i, 1)
      }
      for (let i = pings.length - 1; i >= 0; i--) {
        pings[i].life -= dt * 2.4
        if (pings[i].life <= 0) pings.splice(i, 1)
      }

      drawScene(elapsed)
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
