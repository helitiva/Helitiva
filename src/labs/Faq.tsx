import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Reveal } from '../landing/Reveal'
import { Stagger, Item } from './anim'

const FAQS = [
  {
    q: 'How does an engagement start?',
    a: 'With a 30-minute call. We ask about the problem, the data you have, and the constraints, then send a written probe plan with a fixed price within two business days. No commitment until you approve it.',
  },
  {
    q: 'What if the experiment fails?',
    a: 'Then it fails fast and cheap, which is the point of a lab. You keep the code, the data, and a written post-mortem on why. A clean kill is a result, not a refund case.',
  },
  {
    q: 'What does the 14-day prototype include?',
    a: 'Working software on a staging URL: the core loop of the idea, end to end, with evaluation numbers wherever they exist. Something you can click, share, and judge. Not a slide deck.',
  },
  {
    q: 'Who owns the IP and the code?',
    a: 'You do, from the first commit. The repository lives in your organization, the infrastructure runs on your accounts, and IP assignment is written into the contract.',
  },
  {
    q: 'How do you price?',
    a: 'Fixed scope, fixed price, per phase. You see the full cost before each phase starts, and you can stop at any phase boundary and keep everything built so far.',
  },
  {
    q: 'Can the lab embed with our team?',
    a: 'Yes. We work async-first with weekly demos, and we are comfortable inside an existing codebase. We start with a short paid audit, then propose where the lab can add the most.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`rounded-xl border transition-colors ${
        open ? 'border-emerald-500/25 bg-emerald-500/[0.03]' : 'border-white/[0.07] bg-white/[0.015]'
      }`}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-display font-semibold text-[15px]">{q}</span>
        <Plus
          size={16}
          className={`shrink-0 text-emerald-400 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden min-h-0">
          <p className="px-5 pb-5 text-[14px] text-slate-400 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  )
}

export function Faq() {
  return (
    <section id="faq" className="relative px-5 md:px-8 py-24 scroll-mt-16">
      <div className="max-w-[760px] mx-auto">
        <Reveal>
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-tight text-center">
            Asked before you ask.
          </h2>
        </Reveal>
        <Stagger className="mt-10 space-y-3" stagger={0.08}>
          {FAQS.map((f) => (
            <Item key={f.q}>
              <FaqItem {...f} />
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
