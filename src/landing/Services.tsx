import { Layout, Bot, Zap, TrendingUp, Check } from 'lucide-react'
import { AnimatedTabs } from '@/components/lazy-ui/animated-tabs'
import { Reveal } from './Reveal'

interface ServicePanel {
  icon: React.ReactNode
  title: string
  body: string
  points: string[]
  chips: string[]
}

function Panel({ icon, title, body, points, chips }: ServicePanel) {
  return (
    <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
      <div>
        <div className="w-11 h-11 rounded-xl border border-emerald-500/25 bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-5">
          {icon}
        </div>
        <h3 className="font-display font-bold text-[24px] leading-snug mb-3">{title}</h3>
        <p className="text-[14.5px] text-slate-300 leading-relaxed">{body}</p>
        <div className="flex flex-wrap gap-2 mt-6">
          {chips.map((c) => (
            <span
              key={c}
              className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[12px] text-slate-300"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-3 md:pt-1">
        {points.map((p) => (
          <div key={p} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
            <Check size={15} className="text-emerald-400 mt-0.5 shrink-0" />
            <span className="text-[13.5px] text-slate-300 leading-relaxed">{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const TABS = [
  {
    value: 'web',
    label: 'Web Platforms',
    content: (
      <Panel
        icon={<Layout size={20} />}
        title="Applications people choose to use."
        body="SaaS products, internal tools, and marketplaces built to feel considered: fast, intuitive, and still maintainable years from now."
        points={[
          'From first wireframe to production deploy, including auth, billing, and admin.',
          'Performance budgets and accessibility checks on every release.',
          'Architecture documented well enough for any team to take over.',
        ]}
        chips={['SaaS', 'Internal tools', 'Marketplaces', 'Public APIs']}
      />
    ),
  },
  {
    value: 'ai',
    label: 'Intelligent Systems',
    content: (
      <Panel
        icon={<Bot size={20} />}
        title="AI that earns its keep."
        body="Document understanding, agents with tool access, and knowledge systems that cite their sources. Built for production, not for demos."
        points={[
          'Every system ships with evaluation suites and monitoring, not vibes.',
          'Grounded answers with citations, so users can verify instead of trust.',
          'Model-agnostic design: swap providers without rewriting the product.',
        ]}
        chips={['RAG', 'Agents', 'Document AI', 'Evaluation']}
      />
    ),
  },
  {
    value: 'automation',
    label: 'Automation',
    content: (
      <Panel
        icon={<Zap size={20} />}
        title="Workflows that run while you sleep."
        body="We connect your tools, route your data, and absorb the repetitive work. Real infrastructure, not a pile of brittle scripts."
        points={[
          'Retries, error handling, and graceful degradation built in from day one.',
          'Full audit trail: you can always see what ran, when, and why.',
          'Event-driven design that scales from ten runs a day to ten thousand.',
        ]}
        chips={['Integrations', 'Data sync', 'Event-driven', 'Back office']}
      />
    ),
  },
  {
    value: 'growth',
    label: 'Growth Engineering',
    content: (
      <Panel
        icon={<TrendingUp size={20} />}
        title="Search traffic, engineered."
        body="Programmatic page generation, structured data, and internal linking at scale. The technical side of SEO, measured and compounding."
        points={[
          'Thousands of indexable pages generated from your own data.',
          'Structured data and Core Web Vitals handled as engineering work.',
          'Rank and traffic monitoring wired in, so results are visible.',
        ]}
        chips={['Programmatic SEO', 'Structured data', 'Internal linking', 'Monitoring']}
      />
    ),
  },
]

export function Services() {
  return (
    <section id="services" className="relative px-5 md:px-8 py-24 scroll-mt-16">
      <div className="max-w-[1120px] mx-auto">
        <Reveal>
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-tight">
            Four disciplines. <span className="text-emerald-400">One studio.</span>
          </h2>
          <p className="mt-4 text-[15px] text-slate-400 leading-relaxed max-w-[560px]">
            Pick one or combine them. Same team, same process, same handover at the end.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <AnimatedTabs tabs={TABS} animate="blur" className="w-full" />
        </Reveal>
      </div>
    </section>
  )
}
