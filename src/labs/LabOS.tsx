import { Gauge, MonitorPlay, Scissors, FileText } from 'lucide-react'
import { TextScramble } from '@/components/lazy-ui/text-animate/text-scramble'
import { Reveal } from '../landing/Reveal'
import { Stagger, Item } from './anim'

const RITUALS = [
  {
    icon: <Gauge size={18} />,
    name: 'Evals before vibes',
    body: 'Every model choice is a measured choice. If we cannot score it, we do not ship it.',
  },
  {
    icon: <MonitorPlay size={18} />,
    name: 'Demo Friday',
    body: 'Working software every week. No slideware, no status theater.',
  },
  {
    icon: <Scissors size={18} />,
    name: 'Kill review',
    body: 'Experiments die in a meeting, not in a drawer. Each kill gets a written post-mortem.',
  },
  {
    icon: <FileText size={18} />,
    name: 'Docs as deliverable',
    body: 'If it is not written down, it did not ship. Documentation is part of the contract.',
  },
]

export function LabOS() {
  return (
    <section className="relative px-5 md:px-8 py-24">
      <div className="max-w-[1120px] mx-auto">
        <Reveal className="max-w-[560px]">
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-tight">
            The operating system.
          </h2>
          <p className="mt-4 text-[15px] text-slate-400 leading-relaxed">
            Four rituals keep the lab honest, week after week.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid sm:grid-cols-2 gap-5" stagger={0.1}>
          {RITUALS.map((r) => (
            <Item key={r.name}>
              <div className="group h-full rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 transition-colors hover:border-emerald-500/25">
                <div className="flex items-center gap-3.5 mb-3">
                  <span className="flex w-10 h-10 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] items-center justify-center text-emerald-400 shrink-0 transition-transform duration-300 group-hover:scale-110">
                    {r.icon}
                  </span>
                  <h3 className="font-display font-bold text-[18px]">
                    <TextScramble text={r.name} trigger="hover" duration={500} />
                  </h3>
                </div>
                <p className="text-[13.5px] text-slate-400 leading-relaxed">{r.body}</p>
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
