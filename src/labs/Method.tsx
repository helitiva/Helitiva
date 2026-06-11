import { motion, useReducedMotion } from 'motion/react'
import { Check, Compass, FlaskConical, Factory, ShieldCheck } from 'lucide-react'
import { GridBackground } from '@/components/lazy-ui/grid-background'
import { Reveal } from '../landing/Reveal'
import { Stagger, Item } from './anim'

function ConnectorLine() {
  const reduce = useReducedMotion()
  return (
    <div className="hidden md:block absolute top-[44px] left-[8%] right-[8%] pointer-events-none">
      <motion.div
        className="h-px origin-left bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* probe travelling along the line: lab work flows left to right */}
      {!reduce && (
        <motion.span
          className="absolute -top-[3px] w-[7px] h-[7px] rounded-full bg-emerald-300"
          style={{ boxShadow: '0 0 10px rgba(52, 211, 153, 0.9), 0 0 22px rgba(16, 185, 129, 0.5)' }}
          initial={{ left: '0%', opacity: 0 }}
          whileInView={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 3.6, delay: 1.2, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}

/* Probe: the written plan, its three items checked off one by one. */
function ProbeViz() {
  const rows = ['question', 'constraints', 'win criteria']
  return (
    <div className="w-full max-w-[185px] space-y-2.5" aria-hidden="true">
      {rows.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className="plan-check inline-flex w-4 h-4 rounded-full border border-emerald-400/60 text-emerald-300 items-center justify-center shrink-0"
            style={{ animationDelay: `${i * 1.3}s` }}
          >
            <Check size={9} strokeWidth={3} />
          </span>
          <span className="font-mono text-[8.5px] tracking-[0.12em] uppercase text-slate-400 shrink-0">{label}</span>
          <span className="flex-1 h-1 rounded-full bg-slate-500/20" />
        </div>
      ))}
    </div>
  )
}

/* Prototype: the staging build ships, then the verdict stamp lands. */
function SprintViz() {
  return (
    <div className="relative w-full max-w-[195px] rounded-md border border-white/10 bg-[#070d0f] overflow-hidden" aria-hidden="true">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-white/[0.06]">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500/40" />
        <span className="ml-1 font-mono text-[8px] tracking-[0.08em] text-slate-500">staging.helitiva.dev</span>
      </div>
      <div className="p-2.5 space-y-1.5">
        <div className="h-1.5 rounded-full bg-slate-500/15 overflow-hidden">
          <span className="stage-prog block h-full rounded-full bg-emerald-400/80" />
        </div>
        <div className="h-1 w-3/4 rounded-full bg-slate-500/15" />
        <div className="h-1 w-1/2 rounded-full bg-slate-500/15" />
      </div>
      <span className="stamp-keep absolute inset-0 m-auto w-fit h-fit font-mono text-[10px] tracking-[0.2em] text-emerald-300 border-2 border-emerald-400/80 rounded px-2 py-0.5 bg-[#04130d]/80">
        KEEP
      </span>
      <span className="stamp-kill absolute inset-0 m-auto w-fit h-fit font-mono text-[10px] tracking-[0.2em] text-rose-300 border-2 border-rose-400/80 rounded px-2 py-0.5 bg-[#170709]/80">
        KILL
      </span>
    </div>
  )
}

/* Production: quality gates pass, then everything travels to your repo. */
function HandoverViz() {
  const gates = ['tests', 'security', 'docs']
  return (
    <div className="w-full max-w-[205px]" aria-hidden="true">
      <div className="flex gap-1.5 justify-center">
        {gates.map((g, i) => (
          <span
            key={g}
            className="gate-badge font-mono text-[8px] tracking-[0.12em] uppercase border rounded-full px-2 py-0.5"
            style={{ animationDelay: `${i * 0.8}s` }}
          >
            {g}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-slate-500 shrink-0">lab</span>
        <span className="relative flex-1 h-px bg-slate-500/25">
          <span
            className="handover-dot absolute -top-[3px] w-[7px] h-[7px] rounded-full bg-emerald-300"
            style={{ boxShadow: '0 0 8px rgba(52, 211, 153, 0.9)' }}
          />
        </span>
        <span className="repo-chip font-mono text-[8px] tracking-[0.12em] uppercase border rounded-full px-2 py-0.5 shrink-0">
          your repo
        </span>
      </div>
    </div>
  )
}

const PHASES = [
  {
    phase: 'Probe',
    when: 'week 1',
    body: 'We frame the question, the constraints, and what a win looks like. You get a written plan before any code.',
    icon: <Compass size={18} />,
    num: '01',
    viz: <ProbeViz />,
    caption: 'the written plan',
  },
  {
    phase: 'Prototype',
    when: '14 days',
    body: 'A falsifiable demo on a staging URL. Keep it or kill it, with data either way.',
    icon: <FlaskConical size={18} />,
    num: '02',
    viz: <SprintViz />,
    caption: 'keep it or kill it',
  },
  {
    phase: 'Production',
    when: 'what survives',
    body: 'Engineered properly: tests, security, documentation. Your repo, your infra, your IP.',
    icon: <Factory size={18} />,
    num: '03',
    viz: <HandoverViz />,
    caption: 'everything transfers',
  },
]

export function Method() {
  return (
    <section id="method" className="relative px-5 md:px-8 py-24 scroll-mt-16 overflow-hidden">
      <GridBackground
        variant="dots"
        size={30}
        dotSize={1.5}
        color="rgba(16, 185, 129, 0.10)"
        fade="edges"
        fadeStrength={1}
      />
      <div className="relative z-10 max-w-[1120px] mx-auto">
        <Reveal className="max-w-[560px]">
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-tight">
            From lab to product.
          </h2>
          <p className="mt-4 text-[15px] text-slate-400 leading-relaxed">
            Curiosity is free. Engineering is disciplined.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid md:grid-cols-3 gap-5 relative" stagger={0.16}>
          {/* connector line draws itself across as the cards arrive */}
          <ConnectorLine />
          {PHASES.map((p) => (
            <Item key={p.phase} className="h-full">
              <div
                className="group relative h-full rounded-[22px] border border-white/[0.08] p-6 transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden flex flex-col"
                style={{
                  background:
                    'radial-gradient(120% 65% at 18% 0%, rgba(16, 185, 129, 0.09), transparent 55%), linear-gradient(165deg, #0d1813 0%, #08100c 45%, #060a0b 100%)',
                }}
              >
                {/* ghost numeral watermark */}
                <span className="absolute -bottom-4 right-3 font-display font-bold text-[88px] leading-none text-white/[0.04] select-none pointer-events-none">
                  {p.num}
                </span>
                <div className="flex items-center justify-between mb-5">
                  <span className="w-10 h-10 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] flex items-center justify-center text-emerald-400 transition-transform duration-300 group-hover:scale-110">
                    {p.icon}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.12em] text-emerald-400/90 uppercase">{p.when}</span>
                </div>
                <h3 className="font-display font-bold text-[20px] mb-2.5">{p.phase}</h3>
                <p className="text-[13.5px] text-slate-400 leading-relaxed">{p.body}</p>
                <div className="mt-5 pt-4 border-t border-white/[0.06] flex-1 flex flex-col justify-end">
                  <div className="h-[76px] flex items-center justify-center">{p.viz}</div>
                  <div className="mt-2 text-center font-mono text-[9px] tracking-[0.16em] uppercase text-slate-500">
                    {p.caption}
                  </div>
                </div>
              </div>
            </Item>
          ))}
        </Stagger>

        <Reveal delay={0.25} className="mt-8">
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] px-6 py-5 flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl border border-emerald-500/25 bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <p className="text-[14px] text-slate-300 leading-relaxed">
              Every engagement ends with <span className="text-emerald-300 font-semibold">full source handover</span> and
              <span className="text-emerald-300 font-semibold"> 30 days of post-launch support</span>. No lock-in, ever.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
