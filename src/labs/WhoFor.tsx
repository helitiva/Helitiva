import { Rocket, Building2, LineChart, ArrowRight } from 'lucide-react'
import { Reveal } from '../landing/Reveal'

const PERSONAS = [
  {
    Icon: Rocket,
    who: 'Founders',
    body: 'You have a bet to validate before the next round. We make it demoable in two weeks.',
    move: 'A Prototype Sprint on your riskiest assumption, demoable before the next investor call.',
    chips: ['14-day demo', 'pitch-ready'],
  },
  {
    Icon: Building2,
    who: 'Operating teams',
    body: 'Your back office eats hours. We automate the boring parts and audit the risky ones.',
    move: 'An operations agent on your ugliest workflow, end to end, with a full audit trail.',
    chips: ['one workflow, fully done', 'audit trail'],
  },
  {
    Icon: LineChart,
    who: 'Funds & analysts',
    body: 'You want simulations and signals you can defend to a committee. Not a black box.',
    move: 'A simulation run on one live question, with calibrated confidence bands attached.',
    chips: ['hard numbers', 'committee-ready'],
  },
]

export function WhoFor() {
  return (
    <section className="relative px-5 md:px-8 py-24">
      <div className="max-w-[1120px] mx-auto">
        <Reveal className="max-w-[560px]">
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-tight">
            Built for people with real stakes.
          </h2>
          <p className="mt-4 text-[15px] text-slate-400 leading-relaxed">
            Hover a seat at the table to see the first thing we would build with you.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          {/* stage: organic color field behind the panel, same palette as the page */}
          <div className="relative rounded-[28px] border border-white/[0.08] overflow-hidden p-4 sm:p-6 md:p-9">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute inset-0 bg-[#071009]" />
              <div
                className="absolute -left-28 -top-36 w-[520px] h-[520px] rounded-full blur-xl"
                style={{ background: 'radial-gradient(circle at 32% 30%, rgba(52, 211, 153, 0.85), rgba(16, 185, 129, 0.3) 72%)' }}
              />
              <div
                className="absolute -right-36 -top-20 w-[600px] h-[600px] rounded-full blur-xl"
                style={{ background: 'radial-gradient(circle at 60% 35%, rgba(21, 170, 191, 0.8), rgba(14, 116, 144, 0.22) 72%)' }}
              />
              <div
                className="absolute left-1/4 -bottom-48 w-[480px] h-[480px] rounded-full blur-xl"
                style={{ background: 'radial-gradient(circle at 50% 40%, rgba(110, 231, 183, 0.55), transparent 70%)' }}
              />
            </div>

            {/* the panel sits on the color field */}
            <div className="relative rounded-[22px] border border-white/[0.1] overflow-hidden md:flex bg-[#080f0c]/[0.88] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_60px_-20px_rgba(0,0,0,0.6)]">
            {PERSONAS.map((p, i) => (
              <div
                key={p.who}
                className={`group relative flex-1 md:hover:flex-[1.8] transition-all duration-500 ease-out p-7 md:p-8 hover:bg-white/[0.02] overflow-hidden ${
                  i > 0 ? 'border-t md:border-t-0 md:border-l border-white/[0.07]' : ''
                }`}
              >
                {/* oversized ghost icon */}
                <p.Icon
                  size={150}
                  strokeWidth={1}
                  className="absolute -bottom-8 -right-6 text-emerald-200/[0.04] pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                />

                <span className="flex w-11 h-11 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] items-center justify-center text-emerald-400 mb-5 transition-all duration-300 group-hover:border-emerald-500/45 group-hover:bg-emerald-500/15 group-hover:scale-110">
                  <p.Icon size={19} />
                </span>
                <h3 className="font-display font-bold text-[20px] mb-2 group-hover:text-emerald-200 transition-colors">
                  {p.who}
                </h3>
                <p className="text-[13.5px] text-slate-400 leading-relaxed">{p.body}</p>

                {/* revealed on hover (always visible on mobile) */}
                <div className="mt-5 pt-4 border-t border-white/[0.06] transition-all duration-500 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-emerald-400/90 mb-2">
                    <ArrowRight size={10} /> first move
                  </div>
                  <p className="text-[13px] text-slate-300 leading-relaxed">{p.move}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.chips.map((c) => (
                      <span
                        key={c}
                        className="font-mono text-[9px] tracking-[0.1em] uppercase border border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-300 rounded-full px-2.5 py-1"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
