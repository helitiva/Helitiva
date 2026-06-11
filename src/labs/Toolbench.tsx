import { Reveal } from '../landing/Reveal'

const LOGOS = [
  { slug: 'anthropic', name: 'Anthropic' },
  { slug: 'langchain', name: 'LangChain' },
  { slug: 'python', name: 'Python' },
  { slug: 'pytorch', name: 'PyTorch' },
  { slug: 'typescript', name: 'TypeScript' },
  { slug: 'react', name: 'React' },
  { slug: 'nextdotjs', name: 'Next.js' },
  { slug: 'nodedotjs', name: 'Node.js' },
  { slug: 'fastapi', name: 'FastAPI' },
  { slug: 'postgresql', name: 'PostgreSQL' },
  { slug: 'redis', name: 'Redis' },
  { slug: 'docker', name: 'Docker' },
  { slug: 'vercel', name: 'Vercel' },
  { slug: 'threedotjs', name: 'Three.js' },
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
          width={32}
          height={32}
          loading="lazy"
          className="opacity-55 hover:opacity-100 transition-opacity"
        />
      ))}
    </div>
  )
}

export function Toolbench() {
  return (
    <section className="relative px-5 md:px-8 py-20">
      <div className="max-w-[1120px] mx-auto text-center">
        <Reveal>
          <h2 className="font-display font-bold text-[clamp(28px,3.2vw,38px)] leading-[1.1] tracking-tight">
            The toolbench.
          </h2>
          <p className="mt-4 text-[15px] text-slate-400 leading-relaxed max-w-[520px] mx-auto">
            Frontier models on top, boring infrastructure underneath. Chosen for
            reliability, not fashion.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-10">
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
