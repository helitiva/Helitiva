import { Logo } from '../landing/Logo'

const LINKS = [
  { href: '#research', label: 'Research' },
  { href: '#experiments', label: 'Experiments' },
  { href: '#method', label: 'Method' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="relative px-5 md:px-8 pb-10 pt-6 overflow-hidden">
      {/* the whole footer is the black hole's stage; content floats above it */}
      <div id="blackhole-anchor" className="absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 max-w-[1120px] mx-auto border-t border-white/[0.07] pt-10 pb-[360px]">
        <div className="flex flex-wrap items-start justify-between gap-8 pb-10">
          <div>
            <span className="flex items-center gap-2.5">
              <Logo size={24} />
              <span className="font-display font-bold text-[16px] tracking-tight">
                Helitiva <span className="text-emerald-400">Labs_</span>
              </span>
            </span>
            <p className="mt-3 text-[13px] text-slate-500 leading-relaxed max-w-[280px]">
              An applied AI lab. We test what's next, and ship what survives.
            </p>
          </div>
          <div className="flex gap-6">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-[13px] text-slate-400 hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>
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
