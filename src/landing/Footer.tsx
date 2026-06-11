import { Wordmark } from './Logo'

const COLS = [
  {
    title: 'Services',
    links: [
      { href: '#services', label: 'Web Platforms' },
      { href: '#services', label: 'Intelligent Systems' },
      { href: '#services', label: 'Automation' },
      { href: '#services', label: 'Growth Engineering' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { href: '#process', label: 'Process' },
      { href: '#stack', label: 'Stack' },
      { href: '#faq', label: 'FAQ' },
      { href: '#contact', label: 'Contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative px-5 md:px-8 pb-10 pt-6">
      <div className="max-w-[1120px] mx-auto border-t border-white/[0.07] pt-10">
        <div className="grid md:grid-cols-4 gap-10 pb-10">
          <div className="md:col-span-2">
            <Wordmark size={24} textClass="text-[16px]" />
            <p className="mt-3 text-[13px] text-slate-500 leading-relaxed max-w-[280px]">
              A product studio for web platforms, AI systems, and automation. Built in weeks, yours forever.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <div className="text-[12px] font-semibold tracking-[0.08em] uppercase text-slate-500 mb-4">
                {col.title}
              </div>
              <div className="space-y-2.5">
                {col.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="block text-[13px] text-slate-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-3">
          <span className="text-[12px] text-slate-500">© 2026 Helitiva. All rights reserved.</span>
          <a href="mailto:hello@helitiva.com" className="text-[12px] text-slate-500 hover:text-emerald-300 transition-colors">
            hello@helitiva.com
          </a>
        </div>
      </div>
    </footer>
  )
}
