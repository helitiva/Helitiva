import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { TextRise } from '@/components/lazy-ui/text-animate/text-rise'
import { TextScramble } from '@/components/lazy-ui/text-animate/text-scramble'

export function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const fadeIn = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section ref={sectionRef} id="top" className="relative min-h-[100dvh] flex items-center px-5 md:px-8 pt-20 pb-12 overflow-hidden">
      {/* scrim keeps the left column readable over the galaxy behind the page */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#05080a] from-15% via-[#05080a]/55 via-45% to-transparent" />

      {/* story chips: what goes in, what comes out (outside the masked halo) */}
      <motion.div {...fadeIn(1.1)} className="hidden lg:block absolute top-[24%] right-[34%] float-slow z-10">
        <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-emerald-200/90 border border-emerald-500/25 bg-[#071a12]/80 backdrop-blur-sm rounded-md px-3 py-2">
          scenario in
        </span>
      </motion.div>
      <motion.div
        {...fadeIn(1.3)}
        className="hidden lg:block absolute bottom-[24%] right-[7%] float-slow z-10"
        style={{ animationDelay: '-3s' }}
      >
        <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-emerald-200/90 border border-emerald-500/25 bg-[#071a12]/80 backdrop-blur-sm rounded-md px-3 py-2">
          probabilities out
        </span>
      </motion.div>

      <div className="relative z-10 max-w-[1120px] w-full mx-auto">
        <motion.div {...fadeIn(0)} className="inline-flex items-center gap-2.5 mb-7">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-mono text-[11px] font-semibold tracking-[0.16em] uppercase text-emerald-300">
            <TextScramble text="Lab is open · accepting partners" trigger="mount" duration={1400} />
          </span>
        </motion.div>

        <h1 className="font-display font-bold text-[clamp(40px,6vw,76px)] leading-[1.04] tracking-[-0.03em] max-w-[820px]">
          <TextRise text="We build what's next," trigger wordStagger={0.09} letterStagger={0.02} />
          <br />
          <motion.span
            {...fadeIn(0.45)}
            className="inline-block bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent pb-1"
          >
            before it's obvious.
          </motion.span>
        </h1>

        <motion.p {...fadeIn(0.6)} className="mt-7 text-[16px] text-slate-300 leading-relaxed max-w-[460px]">
          Helitiva is an applied AI lab. We prototype with frontier tech, measure
          everything, and ship what survives contact with reality.
        </motion.p>

        <motion.div {...fadeIn(0.75)} className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="btn-lab inline-flex items-center gap-2 h-13 px-7 rounded-full text-[14.5px] font-bold"
          >
            Work with the lab <ArrowRight size={16} />
          </a>
          <a
            href="#experiments"
            className="inline-flex items-center h-13 px-7 rounded-full border border-white/10 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-emerald-500/40 hover:text-white hover:-translate-y-0.5"
          >
            See experiments
          </a>
        </motion.div>
      </div>
    </section>
  )
}
