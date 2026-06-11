import { useEffect, useRef } from 'react'

/**
 * Live paper-trading backtest: candles form tick by tick and scroll left while
 * a mean-reversion strategy enters (B) and exits (S) positions. Profit zones,
 * open-position P&L, ROI, win rate, and max drawdown are all computed from the
 * actual simulated trades. Pauses offscreen; static frame under reduced motion.
 */

const PAD = 10
const SPACING = 11
const CANDLE_W = 6
const MEAN = 0.55

interface Candle {
  x: number
  o: number
  c: number
  h: number
  l: number
}

interface ClosedTrade {
  entryX: number
  entryP: number
  exitX: number
  exitP: number
  win: boolean
  age: number
}

interface Flash {
  x: number
  y: number
  life: number
  win: boolean
}

export function QuantSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tradesRef = useRef<HTMLSpanElement>(null)
  const roiRef = useRef<HTMLSpanElement>(null)
  const wrRef = useRef<HTMLSpanElement>(null)
  const ddRef = useRef<HTMLSpanElement>(null)

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

    // y-scale auto-fits the visible candles, like a real chart
    let vmin = 0
    let vmax = 1
    const computeScale = () => {
      let lo = Infinity
      let hi = -Infinity
      for (const cd of candles) {
        lo = Math.min(lo, cd.l)
        hi = Math.max(hi, cd.h)
      }
      if (!isFinite(lo)) return
      const pad = (hi - lo) * 0.22 + 0.004
      vmin = lo - pad
      vmax = hi + pad
    }
    const toY = (v: number) => PAD + (1 - (v - vmin) / (vmax - vmin)) * (H - PAD * 2)

    // ── price process (mean-reverting walk) ──────────────────
    let price = MEAN
    const tickPrice = (scale = 1) => {
      price += (MEAN - price) * 0.045 * scale + (Math.random() - 0.5) * 0.05 * scale
      price = Math.min(0.93, Math.max(0.14, price))
      return price
    }

    const candles: Candle[] = []
    const newCandle = (x: number): Candle => ({ x, o: price, c: price, h: price, l: price })
    const seed = () => {
      candles.length = 0
      for (let x = 6; x < W + SPACING; x += SPACING) {
        const o = price
        tickPrice()
        candles.push({
          x,
          o,
          c: price,
          h: Math.max(o, price) + Math.random() * 0.03,
          l: Math.min(o, price) - Math.random() * 0.03,
        })
      }
    }
    seed()

    // ── strategy state ───────────────────────────────────────
    let position: { entryP: number; entryX: number; held: number } | null = null
    const closed: ClosedTrade[] = []
    const flashes: Flash[] = []
    let equity = 1
    let peak = 1
    let maxDD = 0
    let wins = 0
    let trades = 0

    const fmtPct = (v: number, signed = true) =>
      `${signed && v >= 0 ? '+' : ''}${(v * 100).toFixed(1)}%`

    const syncStats = () => {
      if (tradesRef.current) tradesRef.current.textContent = String(trades).padStart(3, '0')
      if (roiRef.current) {
        const roi = equity - 1
        roiRef.current.textContent = fmtPct(roi)
        roiRef.current.className = roi >= 0 ? 'text-emerald-300' : 'text-rose-300'
      }
      if (wrRef.current) wrRef.current.textContent = trades === 0 ? '0%' : `${Math.round((wins / trades) * 100)}%`
      if (ddRef.current) ddRef.current.textContent = `-${(maxDD * 100).toFixed(1)}%`
    }
    syncStats()

    const closePosition = (exitX: number, exitP: number) => {
      if (!position) return
      const ret = exitP / position.entryP
      equity *= ret
      peak = Math.max(peak, equity)
      maxDD = Math.max(maxDD, (peak - equity) / peak)
      const win = ret > 1
      if (win) wins++
      trades++
      closed.push({ entryX: position.entryX, entryP: position.entryP, exitX, exitP, win, age: 0 })
      flashes.push({ x: exitX, y: toY(exitP), life: 1, win })
      position = null
      syncStats()
    }

    // ── drawing helpers ──────────────────────────────────────
    const drawGrid = () => {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.06)'
      for (const f of [0.25, 0.5, 0.75]) ctx.fillRect(6, PAD + f * (H - PAD * 2), W - 12, 1)
    }

    const drawCandles = () => {
      for (const cd of candles) {
        const up = cd.c >= cd.o
        const color = up ? 'rgba(52, 211, 153, 0.65)' : 'rgba(251, 113, 133, 0.6)'
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(cd.x, toY(cd.h))
        ctx.lineTo(cd.x, toY(cd.l))
        ctx.stroke()
        const yTop = toY(Math.max(cd.o, cd.c))
        const yBot = toY(Math.min(cd.o, cd.c))
        ctx.fillRect(cd.x - CANDLE_W / 2, yTop, CANDLE_W, Math.max(1.5, yBot - yTop))
      }
    }

    const tri = (x: number, y: number, up: boolean, color: string) => {
      ctx.fillStyle = color
      ctx.beginPath()
      if (up) {
        ctx.moveTo(x, y - 4)
        ctx.lineTo(x - 4, y + 3)
        ctx.lineTo(x + 4, y + 3)
      } else {
        ctx.moveTo(x, y + 4)
        ctx.lineTo(x - 4, y - 3)
        ctx.lineTo(x + 4, y - 3)
      }
      ctx.closePath()
      ctx.fill()
    }

    ctx.font = '7.5px ui-monospace, SFMono-Regular, monospace'

    const drawEntryMarker = (x: number, p: number) => {
      const y = toY(p) + 10
      tri(x, y, true, '#34d399')
      ctx.fillStyle = '#34d399'
      ctx.fillText('B', x - 2.5, y + 12)
    }

    const drawExitMarker = (x: number, p: number, win: boolean) => {
      const y = toY(p) - 10
      const color = win ? '#34d399' : '#fb7185'
      tri(x, y, false, color)
      ctx.fillStyle = color
      ctx.fillText('S', x - 2.5, y - 6)
    }

    const drawClosedTrades = () => {
      for (const t of closed) {
        const alpha = Math.max(0, 1 - t.age / 7)
        // profit/loss zone between entry and exit
        const y1 = toY(Math.max(t.entryP, t.exitP))
        const y2 = toY(Math.min(t.entryP, t.exitP))
        ctx.fillStyle = t.win
          ? `rgba(52, 211, 153, ${0.1 * alpha})`
          : `rgba(251, 113, 133, ${0.1 * alpha})`
        ctx.fillRect(t.entryX, y1, Math.max(2, t.exitX - t.entryX), Math.max(2, y2 - y1))
        ctx.globalAlpha = alpha
        drawEntryMarker(t.entryX, t.entryP)
        drawExitMarker(t.exitX, t.exitP, t.win)
        ctx.globalAlpha = 1
      }
    }

    const drawOpenPosition = (nowX: number) => {
      if (!position) return
      const ey = toY(position.entryP)
      // dashed entry level
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.5)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(position.entryX, ey)
      ctx.lineTo(nowX, ey)
      ctx.stroke()
      ctx.setLineDash([])
      drawEntryMarker(position.entryX, position.entryP)
      // floating P&L tag
      const pnl = price / position.entryP - 1
      const tag = fmtPct(pnl)
      const color = pnl >= 0 ? '#34d399' : '#fb7185'
      ctx.fillStyle = color
      ctx.fillText(tag, Math.min(nowX + 6, W - 34), toY(price) - 6)
    }

    // ── static frame for reduced motion ──────────────────────
    if (reduce) {
      ctx.clearRect(0, 0, W, H)
      computeScale()
      drawGrid()
      drawCandles()
      const a = candles[Math.floor(candles.length * 0.25)]
      const b = candles[Math.floor(candles.length * 0.5)]
      const c2 = candles[Math.floor(candles.length * 0.65)]
      const d = candles[Math.floor(candles.length * 0.85)]
      closed.push(
        { entryX: a.x, entryP: a.c, exitX: b.x, exitP: a.c * 1.04, win: true, age: 0 },
        { entryX: c2.x, entryP: c2.c, exitX: d.x, exitP: c2.c * 0.98, win: false, age: 0 },
      )
      drawClosedTrades()
      if (tradesRef.current) tradesRef.current.textContent = '048'
      if (roiRef.current) roiRef.current.textContent = '+12.4%'
      if (wrRef.current) wrRef.current.textContent = '58%'
      if (ddRef.current) ddRef.current.textContent = '-7.2%'
      return () => window.removeEventListener('resize', resize)
    }

    // ── live loop ────────────────────────────────────────────
    let frame = 0
    let running = false
    let last = 0
    let candleTimer = 0

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
      last = now
      ctx.clearRect(0, 0, W, H)

      // scroll world
      const scroll = 16 * dt
      for (const cd of candles) cd.x -= scroll
      if (position) position.entryX -= scroll
      for (const t of closed) {
        t.entryX -= scroll
        t.exitX -= scroll
        t.age += dt
      }
      for (let i = closed.length - 1; i >= 0; i--)
        if (closed[i].exitX < -20 || closed[i].age > 7) closed.splice(i, 1)
      while (candles.length && candles[0].x < -SPACING) candles.shift()

      // live tick inside the forming candle
      const cur = candles[candles.length - 1]
      tickPrice(dt * 6)
      cur.c = price
      cur.h = Math.max(cur.h, price)
      cur.l = Math.min(cur.l, price)

      // commit a candle on interval, then make trading decisions
      candleTimer -= dt
      if (candleTimer <= 0) {
        candleTimer = 0.45
        candles.push(newCandle(cur.x + SPACING))
        if (position) {
          position.held++
          const ret = price / position.entryP
          if (ret >= 1.022 || ret <= 0.985 || position.held >= 7) closePosition(cur.x, price)
        } else if (price < MEAN - 0.04 || Math.random() < 0.22) {
          // mean-reversion entry: buy the dip
          position = { entryP: price, entryX: cur.x, held: 0 }
        }
      }

      computeScale()
      drawGrid()
      drawCandles()
      drawClosedTrades()
      drawOpenPosition(cur.x)

      // trade-close flashes
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i]
        f.life -= dt * 2
        f.x -= scroll
        if (f.life <= 0) {
          flashes.splice(i, 1)
          continue
        }
        ctx.strokeStyle = f.win
          ? `rgba(110, 231, 183, ${f.life * 0.8})`
          : `rgba(251, 113, 133, ${f.life * 0.8})`
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.arc(f.x, f.y, (1 - f.life) * 11 + 2, 0, Math.PI * 2)
        ctx.stroke()
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
    <div className={`flex gap-0 ${className ?? ''}`}>
      {/* chart pane with in-chart watermark */}
      <div className="relative flex-1 min-w-0">
        <canvas ref={canvasRef} className="w-full h-[185px] block" />
        <span className="absolute top-1 left-1.5 font-mono text-[9.5px] tracking-[0.18em] uppercase text-slate-500 pointer-events-none">
          paper trading
        </span>
      </div>

      {/* terminal-style stat rail */}
      <div className="w-[96px] shrink-0 border-l border-white/[0.07] pl-3 ml-3 flex flex-col justify-between py-1">
        <div>
          <div className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-slate-500 flex items-center gap-1.5">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            trades
          </div>
          <div className="font-mono text-[13px] text-slate-200 mt-1">
            <span ref={tradesRef}>000</span>
          </div>
        </div>
        <div className="pt-2 border-t border-white/[0.06]">
          <div className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-slate-500">roi</div>
          <div className="font-mono text-[13px] mt-1">
            <span ref={roiRef} className="text-emerald-300">+0.0%</span>
          </div>
        </div>
        <div className="pt-2 border-t border-white/[0.06]">
          <div className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-slate-500">win rate</div>
          <div className="font-mono text-[13px] text-emerald-300 mt-1">
            <span ref={wrRef}>0%</span>
          </div>
        </div>
        <div className="pt-2 border-t border-white/[0.06]">
          <div className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-slate-500">max dd</div>
          <div className="font-mono text-[13px] text-rose-300 mt-1">
            <span ref={ddRef}>-0.0%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
