import { Network, CandlestickChart, Bot, Radar } from 'lucide-react'
import { TextScramble } from '@/components/lazy-ui/text-animate/text-scramble'
import { Reveal } from '../landing/Reveal'
import { Stagger, Item } from './anim'
import { StatusPill, type LabStatus } from './StatusPill'
import { FanSim } from './FanSim'
import { QuantSim } from './QuantSim'
import { OsintScan } from './OsintScan'
import { AgentOps } from './AgentOps'

/* ── per-track graphics ───────────────────────────────────── */
/* Live Monte-Carlo canvas lives in FanSim.tsx; walk-forward backtest in QuantSim.tsx */

/* ── tracks ───────────────────────────────────────────────── */

const TRACKS: {
  name: string
  desc: string
  status: LabStatus
  icon: React.ReactNode
  viz: React.ReactNode
}[] = [
  {
    name: 'Scenario simulation',
    desc: 'Multi-agent engines that turn a written scenario into probabilities you can defend.',
    status: 'INCUBATING',
    icon: <Network size={18} />,
    viz: <FanSim />,
  },
  {
    name: 'Quantitative trading systems',
    desc: 'LLM-assisted factor research with walk-forward validation, not curve-fit backtests.',
    status: 'EXPLORING',
    icon: <CandlestickChart size={18} />,
    viz: <QuantSim />,
  },
  {
    name: 'Autonomous operations',
    desc: 'Agents with tool access that close tickets, reconcile books, and log every step.',
    status: 'INCUBATING',
    icon: <Bot size={18} />,
    viz: <AgentOps />,
  },
  {
    name: 'OSINT system',
    desc: 'Open-source intelligence pipelines that turn scattered public data into verified, searchable signals.',
    status: 'SHIPPED',
    icon: <Radar size={18} />,
    viz: <OsintScan />,
  },
]

export function ResearchBoard() {
  return (
    <section id="research" className="relative px-5 md:px-8 py-24 scroll-mt-16">
      <div className="max-w-[1120px] mx-auto">
        <Reveal className="max-w-[560px]">
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-tight">
            Now in the lab.
          </h2>
          <p className="mt-4 text-[15px] text-slate-400 leading-relaxed">
            Four research tracks, each held to the same bar: it graduates when it works
            outside the demo.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid sm:grid-cols-2 gap-5" stagger={0.12} id="lab-cards">
          {TRACKS.map((t) => (
            <Item key={t.name}>
              <div
                className="group h-full rounded-[22px] border border-white/[0.08] p-6 transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-1 flex flex-col shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                style={{
                  background:
                    'radial-gradient(120% 65% at 18% 0%, rgba(16, 185, 129, 0.09), transparent 55%), linear-gradient(165deg, #0d1813 0%, #08100c 45%, #060a0b 100%)',
                }}
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="flex w-10 h-10 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] items-center justify-center text-emerald-400 shrink-0 transition-all duration-300 group-hover:border-emerald-500/45 group-hover:bg-emerald-500/15 group-hover:scale-110 group-hover:-rotate-6">
                    {t.icon}
                  </span>
                  <StatusPill status={t.status} />
                </div>
                <h3 className="font-display font-bold text-[20px] tracking-tight group-hover:text-emerald-200 transition-colors">
                  <TextScramble text={t.name} trigger="view" duration={900} />
                </h3>
                <p className="mt-2 text-[13.5px] text-slate-400 leading-relaxed sm:min-h-[44px]">{t.desc}</p>
                <div className="mt-5 flex-1 min-h-[200px] rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex flex-col justify-center">
                  {t.viz}
                </div>
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
