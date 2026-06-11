import { useEffect, useRef } from 'react'
import { Reveal } from '../landing/Reveal'
import { Stagger, Item } from './anim'

/* The 5-act engine demo is authored for a 1024px viewport; render the iframe
   at 1024x576 and scale it down to the wrapper width. */
function ProcessDemo() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const frame = frameRef.current
    if (!wrap || !frame) return
    const fit = () => {
      const w = wrap.clientWidth
      if (w < 1024) {
        frame.style.width = '1024px'
        frame.style.height = '576px'
        frame.style.transform = `scale(${w / 1024})`
        frame.style.transformOrigin = 'top left'
      } else {
        frame.style.width = '100%'
        frame.style.height = '100%'
        frame.style.transform = ''
      }
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: '16 / 9', background: '#04070a' }}
    >
      <iframe
        ref={frameRef}
        src="/process-demo/index.html"
        className="absolute inset-0 border-0"
        scrolling="no"
        title="Engine demo: from a question to a verdict in five acts"
        loading="lazy"
      />
    </div>
  )
}

/**
 * Experiments: 2/3 + 1/3 split.
 * Left: slot for the process demo animation ("from a question to a verdict
 * in 5 acts") — the animation source will be dropped in here when provided.
 * Right: empty stage marked #earth-anchor; the page's dispersed galaxy
 * particles reassemble into a rotating Earth inside it (see Galaxy.tsx).
 */
export function Experiments() {
  return (
    <section id="experiments" className="relative px-5 md:px-8 py-24 scroll-mt-16">
      <div className="max-w-[1120px] mx-auto">
        <Reveal className="max-w-[760px]">
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-tight">
            Latest from the lab
          </h2>
          <p className="mt-4 text-[15px] text-slate-400 leading-relaxed">
            Colix is a prediction engine that turns plain-language scenarios into
            quantitative forecasts. You write a question like{' '}
            <span className="text-slate-200">
              "What's the probability of a recession in the EU in 2027?"
            </span>
            , and Colix builds a simulated world of relevant actors (governments, banks,
            unions, voters), runs them through multiple rounds of interaction and returns
            a hard number with full reasoning. Think of it as{' '}
            <span className="text-emerald-300">a wind tunnel for narratives</span>.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid lg:grid-cols-3 gap-5 items-stretch" stagger={0.12}>
          {/* 2/3: live 5-act engine demo */}
          <Item className="lg:col-span-2">
            <div className="relative h-full rounded-2xl border border-white/[0.07] bg-[#0a1118]/80 p-3 flex flex-col">
              <ProcessDemo />
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 px-2 pb-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-emerald-400/90">live demo</span>
                  <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-slate-500">· 5 acts · 40s loop</span>
                </div>
                <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-slate-500">
                  scenario: uae leaves opec → brent oil +30d
                </span>
              </div>
            </div>
          </Item>

          {/* 1/3: the dispersed particles gather here into a rotating earth */}
          <Item className="h-full">
            <div className="relative h-full min-h-[420px] rounded-2xl border border-white/[0.07] overflow-hidden">
              <div id="earth-anchor" className="absolute inset-0" />
              {/* atmosphere rim glow around the assembled planet */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  width: 'min(84%, 340px)',
                  aspectRatio: '1',
                  boxShadow: '0 0 70px 8px rgba(16, 185, 129, 0.16), inset 0 0 40px rgba(16, 185, 129, 0.07)',
                }}
              />
              <div className="absolute top-4 left-5 font-mono text-[9.5px] tracking-[0.18em] uppercase text-slate-500">
                field test
              </div>
              <p className="absolute bottom-4 inset-x-5 text-center font-mono text-[10px] tracking-[0.14em] uppercase text-emerald-400/70">
                the particle field, reassembled
              </p>
            </div>
          </Item>
        </Stagger>
      </div>
    </section>
  )
}
