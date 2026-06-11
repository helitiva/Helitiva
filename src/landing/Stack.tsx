import { Reveal } from './Reveal'

const LOGOS = [
  { slug: 'nextdotjs', name: 'Next.js' },
  { slug: 'react', name: 'React' },
  { slug: 'typescript', name: 'TypeScript' },
  { slug: 'tailwindcss', name: 'Tailwind CSS' },
  { slug: 'nodedotjs', name: 'Node.js' },
  { slug: 'python', name: 'Python' },
  { slug: 'fastapi', name: 'FastAPI' },
  { slug: 'postgresql', name: 'PostgreSQL' },
  { slug: 'redis', name: 'Redis' },
  { slug: 'docker', name: 'Docker' },
  { slug: 'vercel', name: 'Vercel' },
  { slug: 'anthropic', name: 'Anthropic' },
  { slug: 'langchain', name: 'LangChain' },
]

function LogoRow() {
  return (
    <div className="marquee-track flex items-center gap-14 pr-14 shrink-0">
      {LOGOS.map((l) => (
        <img
          key={l.slug}
          src={`https://cdn.simpleicons.org/${l.slug}/94a3b8`}
          alt={l.name}
          title={l.name}
          width={34}
          height={34}
          loading="lazy"
          className="opacity-55 hover:opacity-100 transition-opacity"
        />
      ))}
    </div>
  )
}

export function Stack() {
  return (
    <section id="stack" className="relative px-5 md:px-8 py-24 scroll-mt-16">
      <div className="max-w-[1120px] mx-auto text-center">
        <Reveal>
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-tight">
            Boring technology, <span className="text-emerald-400">on purpose.</span>
          </h2>
          <p className="mt-4 text-[15px] text-slate-400 leading-relaxed max-w-[540px] mx-auto">
            Proven, well-supported tools chosen for reliability and long-term maintainability.
            Your budget pays for your product, not our experiments.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-12">
        <div
          className="marquee max-w-[1120px] mx-auto flex overflow-hidden"
          style={{
            maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
          }}
        >
          <LogoRow />
          <LogoRow />
        </div>
      </Reveal>
    </section>
  )
}
