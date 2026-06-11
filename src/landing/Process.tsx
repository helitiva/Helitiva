import { ShieldCheck } from 'lucide-react'
import { BorderGlow } from '@/components/lazy-ui/border-glow'
import { Reveal } from './Reveal'

const STEPS = [
  {
    n: '01',
    title: 'Understand',
    body: 'We listen before we estimate. You get a scope document and an architecture proposal before any code is written.',
  },
  {
    n: '02',
    title: 'Build',
    body: 'Weekly sprints with visible progress: staging deploys, async updates, and short video walkthroughs.',
  },
  {
    n: '03',
    title: 'Harden',
    body: 'Automated tests, security review, performance under load. We find the edge cases before your users do.',
  },
  {
    n: '04',
    title: 'Hand over',
    body: 'Source code, credentials, documentation, deployment. Everything transfers. No lock-in, ever.',
  },
]

export function Process() {
  return (
    <section id="process" className="relative px-5 md:px-8 py-24 scroll-mt-16">
      <div className="max-w-[1120px] mx-auto">
        <Reveal className="max-w-[560px]">
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-tight">
            Clear process. <span className="text-emerald-400">No surprises.</span>
          </h2>
          <p className="mt-4 text-[15px] text-slate-400 leading-relaxed">
            Every engagement follows the same four phases, adapted to your timeline but never skipped.
          </p>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <BorderGlow
                mode="cursor"
                colors={['#10b981', '#34d399', '#a7f3d0']}
                background="#0b1217"
                radius={16}
                thickness={1}
                glowSize={14}
                intensity={0.65}
                cursorRadius={180}
                bling={false}
                className="h-full"
              >
                <div className="p-6 h-full">
                  <div className="font-display font-bold text-[15px] text-emerald-400/90 mb-4">{s.n}</div>
                  <h3 className="font-display font-bold text-[18px] mb-2.5">{s.title}</h3>
                  <p className="text-[13.5px] text-slate-400 leading-relaxed">{s.body}</p>
                </div>
              </BorderGlow>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-8">
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] px-6 py-5 flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl border border-emerald-500/25 bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <p className="text-[14px] text-slate-300 leading-relaxed">
              Every engagement ends the same way: your repository, your infrastructure, your
              credentials, and <span className="text-emerald-300 font-semibold">30 days of post-launch support</span>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
