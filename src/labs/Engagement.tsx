import { Check } from 'lucide-react'
import { Reveal } from '../landing/Reveal'
import { Stagger, Item } from './anim'

const MODELS = [
  {
    name: 'Probe Week',
    duration: 'one week',
    desc: 'One week, one question. A written answer: architecture, risk map, and a fixed quote for the next step.',
    includes: ['Scoping call and written brief', 'Probe report with architecture', 'Go or no-go recommendation'],
    featured: false,
  },
  {
    name: 'Prototype Sprint',
    duration: '14 days',
    desc: 'Fourteen days to a falsifiable demo on a staging URL. Keep it or kill it, with data either way.',
    includes: ['Working demo, deployed', 'Evaluation numbers where they exist', 'Source in your repo from day one'],
    featured: true,
  },
  {
    name: 'Lab Residency',
    duration: 'monthly',
    desc: 'The lab embeds with your team month to month. Research, prototypes, and production support on a rolling agenda.',
    includes: ['Rolling research agenda', 'Weekly demos and write-ups', 'Priority on the lab queue'],
    featured: false,
  },
]

export function Engagement() {
  return (
    <section className="relative px-5 md:px-8 py-24">
      <div className="max-w-[1120px] mx-auto">
        <Reveal className="max-w-[560px]">
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-tight">
            Ways to work with the lab.
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid md:grid-cols-3 gap-5 items-stretch" stagger={0.12}>
          {MODELS.map((m) => (
            <Item key={m.name} className="h-full">
              <div
                className={`relative h-full rounded-2xl p-6 flex flex-col transition-transform duration-300 hover:-translate-y-1 ${
                  m.featured
                    ? 'border-2 border-emerald-500/45 bg-emerald-500/[0.05]'
                    : 'border border-white/[0.07] bg-white/[0.015]'
                }`}
              >
                {m.featured && (
                  <span className="absolute -top-3 left-6 font-mono text-[10px] tracking-[0.14em] uppercase text-emerald-200 bg-[#0a2b1e] border border-emerald-500/40 rounded-full px-3 py-1">
                    Most engagements
                  </span>
                )}
                <div className="flex items-baseline justify-between gap-3 mb-3">
                  <h3 className="font-display font-bold text-[20px]">{m.name}</h3>
                  <span className="font-mono text-[11px] tracking-[0.12em] text-emerald-400/90 uppercase shrink-0">{m.duration}</span>
                </div>
                <p className="text-[13.5px] text-slate-400 leading-relaxed">{m.desc}</p>
                <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-2.5">
                  {m.includes.map((inc) => (
                    <div key={inc} className="flex items-start gap-2.5">
                      <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-[13px] text-slate-300 leading-relaxed">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Item>
          ))}
        </Stagger>

        <Reveal delay={0.2} className="mt-8">
          <p className="text-center text-[14px] text-slate-500">
            Every model starts with the same 30-minute call.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
