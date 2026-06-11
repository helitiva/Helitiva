import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { GlassButton } from '@/components/lazy-ui/glass-button'
import { Wordmark } from './Logo'

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#stack', label: 'Stack' },
  { href: '#faq', label: 'FAQ' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: '-40px 0px 0px 0px' },
    )
    const sentinel = document.getElementById('nav-sentinel')
    if (sentinel) io.observe(sentinel)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-5 md:px-8 transition-colors duration-300 ${
          scrolled
            ? 'bg-[#070c10]/75 backdrop-blur-md border-b border-emerald-500/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <a href="#top" aria-label="Helitiva home">
          <Wordmark />
        </a>

        <div className="hidden md:flex items-center gap-7 ml-12">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-slate-400 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <a href="#contact" className="hidden sm:block">
            <GlassButton size="sm" tint="cool" staticGlass distortion={3} className="text-emerald-100 font-semibold">
              Start a project
            </GlassButton>
          </a>
          <button
            className="md:hidden p-2 text-slate-300"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-x-0 top-16 z-40 md:hidden bg-[#070c10]/95 backdrop-blur-md border-b border-emerald-500/10 px-6 py-4 space-y-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-[15px] text-slate-300 hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block py-2.5 text-[15px] font-semibold text-emerald-300"
          >
            Start a project
          </a>
        </div>
      )}
    </>
  )
}
