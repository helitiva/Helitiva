import { motion, useReducedMotion } from 'motion/react'
import { Reveal } from '../landing/Reveal'
import { Stagger, Item } from './anim'

type LogStatus = 'GRADUATED' | 'KILLED' | 'STARTED'

const TAG: Record<LogStatus, string> = {
  GRADUATED: 'text-emerald-300 border-emerald-400/25 bg-emerald-400/[0.06]',
  KILLED: 'text-rose-300 border-rose-400/25 bg-rose-400/[0.06]',
  STARTED: 'text-sky-300 border-sky-400/25 bg-sky-400/[0.06]',
}

const DOT: Record<LogStatus, string> = {
  GRADUATED: 'bg-emerald-400',
  KILLED: 'bg-rose-400',
  STARTED: 'bg-sky-400',
}

const ENTRIES: { quarter: string; status: LogStatus; text: string }[] = [
  { quarter: '2026 Q2', status: 'GRADUATED', text: 'Citetrace moved to production with a compliance team.' },
  { quarter: '2026 Q2', status: 'STARTED', text: 'Mirrorfield calibration harness v2.' },
  { quarter: '2026 Q1', status: 'GRADUATED', text: 'Nightdesk pilot promoted to nightly production runs.' },
  { quarter: '2026 Q1', status: 'KILLED', text: 'Voice agent for field technicians. Latency never met the bar. Post-mortem delivered.' },
  { quarter: '2025 Q4', status: 'STARTED', text: 'Signalbench walk-forward engine.' },
  { quarter: '2025 Q4', status: 'KILLED', text: 'On-device receipt OCR. Accuracy plateaued below useful.' },
]

export function LabLog() {
  const reduce = useReducedMotion()
  return (
    <section id="log" className="relative px-5 md:px-8 py-24 scroll-mt-16">
      <div className="max-w-[860px] mx-auto">
        <Reveal className="max-w-[560px]">
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-tight">
            The lab log.
          </h2>
          <p className="mt-4 text-[15px] text-slate-400 leading-relaxed">
            What graduated, what died, and why. We publish both.
          </p>
        </Reveal>

        <div className="relative mt-12 pl-8">
          {/* rail draws downward as the log enters */}
          <motion.div
            className="absolute left-[5px] top-1 bottom-1 w-px origin-top bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <Stagger stagger={0.12} className="space-y-8">
            {ENTRIES.map((e, i) => (
              <Item key={`${e.quarter}-${e.text}`} from="left">
                <div className="relative">
                  <span className={`absolute -left-8 top-1.5 flex w-[11px] h-[11px] rounded-full ${DOT[e.status]}`}>
                    {i === 0 && (
                      <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${DOT[e.status]}`} />
                    )}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-mono text-[12px] tracking-[0.1em] text-slate-500">{e.quarter}</span>
                    <span className={`font-mono text-[10px] tracking-[0.14em] border rounded-full px-2.5 py-0.5 ${TAG[e.status]}`}>
                      {e.status}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[15px] text-slate-300 leading-relaxed">{e.text}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
