import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { GridBackground } from '@/components/lazy-ui/grid-background'
import { TextRise } from '@/components/lazy-ui/text-animate/text-rise'
import { GlassButton } from '@/components/lazy-ui/glass-button'

export function Hero() {
  const reduce = useReducedMotion()

  const fadeIn = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section id="top" className="relative min-h-[100dvh] flex items-center px-5 md:px-8 pt-20 pb-12 overflow-hidden">
      <GridBackground
        variant="lines"
        size={64}
        color="rgba(16, 185, 129, 0.045)"
        fade="edges"
        fadeStrength={1}
      />
      <div
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.04) 40%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="relative z-10 max-w-[1120px] w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: message */}
        <div className="space-y-7">
          <motion.div {...fadeIn(0)} className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06]">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-emerald-300">
              Accepting projects for Q3 2026
            </span>
          </motion.div>

          <h1 className="font-display font-bold text-[clamp(38px,5vw,64px)] leading-[1.04] tracking-[-0.025em]">
            <TextRise text="Built in weeks." trigger wordStagger={0.1} letterStagger={0.025} />
            <br />
            {/* gradient clip can't reach through per-letter spans, so this line fades in whole */}
            <motion.span
              {...fadeIn(0.4)}
              className="inline-block bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent pb-1"
            >
              Yours forever.
            </motion.span>
          </h1>

          <motion.p {...fadeIn(0.5)} className="text-[16px] text-slate-300 leading-relaxed max-w-[480px]">
            A product studio for web platforms, AI systems, and automation.
            Prototype in 14 days. Every line of code yours.
          </motion.p>

          <motion.div {...fadeIn(0.65)} className="flex flex-wrap items-center gap-3">
            <a href="#contact">
              <GlassButton size="lg" tint="cool" frequency={0.01} distortion={4} className="font-semibold text-emerald-50">
                <span className="flex items-center gap-2">
                  Start a project <ArrowRight size={16} />
                </span>
              </GlassButton>
            </a>
            <a
              href="#services"
              className="inline-flex items-center h-13 px-7 rounded-full border border-white/10 text-sm font-semibold text-slate-200 hover:border-emerald-500/40 hover:text-white transition-colors"
            >
              Explore services
            </a>
          </motion.div>
        </div>

        {/* Right: globe */}
        <motion.div
          {...fadeIn(0.35)}
          className="relative w-full max-w-[520px] mx-auto aspect-square"
        >
          <div
            className="absolute inset-[6%] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 62%)',
              filter: 'blur(36px)',
            }}
          />
          <iframe
            src="/Threejs-globe/index.html"
            title="Helitiva global network"
            className="absolute inset-0 w-full h-full border-0 pointer-events-none select-none"
            style={{ transform: 'scale(1.3)', transformOrigin: 'center' }}
            scrolling="no"
          />
        </motion.div>
      </div>
    </section>
  )
}
