import { Nav } from './Nav'
import { Hero } from './Hero'
import { Stats } from './Stats'
import { Services } from './Services'
import { Process } from './Process'
import { Stack } from './Stack'
import { Faq } from './Faq'
import { Contact } from './Contact'
import { Footer } from './Footer'

export default function Landing() {
  return (
    <div className="relative">
      {/* sentinel for nav scroll state */}
      <div id="nav-sentinel" className="absolute top-0 h-px w-px" />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Process />
        <Stack />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
