import { ShinyText } from '@/components/lazy-ui/text-animate/shiny-text'
import { Stagger, MaskItem } from './anim'

const LINES = [
  'Working code over slide decks.',
  'Two weeks to a falsifiable demo.',
  'Boring tech where it counts, new tech where it pays.',
]

export function Principles() {
  return (
    <section className="relative px-5 md:px-8 py-20">
      <div className="max-w-[1120px] mx-auto">
        <Stagger stagger={0.14} amount={0.25} className="space-y-3 md:space-y-4">
          {LINES.map((line) => (
            <MaskItem key={line}>
              <p className="font-display font-bold text-[clamp(26px,4.2vw,52px)] leading-[1.14] tracking-[-0.02em] text-slate-200">
                {line}
              </p>
            </MaskItem>
          ))}
          <MaskItem>
            <p className="font-display font-bold text-[clamp(26px,4.2vw,52px)] leading-[1.14] tracking-[-0.02em]">
              <ShinyText duration={4} intensity={0.4} className="text-emerald-300">
                Everything we build, you own.
              </ShinyText>
            </p>
          </MaskItem>
        </Stagger>
      </div>
    </section>
  )
}
