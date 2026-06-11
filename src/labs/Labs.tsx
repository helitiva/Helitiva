import { GlowDivider } from './anim'
import { Galaxy } from './Galaxy'
import { Nav } from './Nav'
import { Hero } from './Hero'
import { StatsStrip } from './StatsStrip'
import { ResearchBoard } from './ResearchBoard'
import { Experiments } from './Experiments'
import { Method } from './Method'
import { Engagement } from './Engagement'
import { WhoFor } from './WhoFor'
import { Toolbench } from './Toolbench'
import { Principles } from './Principles'
import { Faq } from './Faq'
import { Dispatch } from './Dispatch'
import { Contact } from './Contact'
import { Footer } from './Footer'

export default function Labs() {
  return (
    <div className="relative">
      {/* persistent particle field: galaxy in the hero, scattered starfield below */}
      <Galaxy className="fixed inset-0 z-0 pointer-events-none" />
      <div id="nav-sentinel" className="absolute top-0 h-px w-px" />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <StatsStrip />
        <ResearchBoard />
        <GlowDivider />
        <Experiments />
        <GlowDivider />
        <Method />
        <Engagement />
        <WhoFor />
        <Toolbench />
        <GlowDivider />
        <Principles />
        <Faq />
        <Dispatch />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
