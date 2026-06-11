import { useRef } from 'react'
import { useInView } from 'motion/react'
import { Counter } from '@/components/lazy-ui/counter'
import { Reveal } from '../landing/Reveal'

const STATS = [
  { value: 14, suffix: ' days', label: 'to a falsifiable demo' },
  { value: 100, suffix: '%', label: 'IP and source ownership' },
  { value: 30, suffix: ' days', label: 'post-launch support' },
  { value: 2, suffix: '', label: 'partner slots per quarter' },
]

export function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <section className="relative px-5 md:px-8 py-14">
      <div className="max-w-[1120px] mx-auto">
        <Reveal>
          <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {STATS.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <div className="font-display font-bold text-[38px] leading-none text-emerald-300">
                  <Counter value={inView ? s.value : 0} speed={1100} easing="ease-out" effect="wheel" />
                  <span className="text-[20px] text-emerald-500/80">{s.suffix}</span>
                </div>
                <div className="mt-2.5 text-[13px] text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
