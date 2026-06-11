import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { AuroraMesh } from '@/components/lazy-ui/aurora-mesh'
import { Reveal } from '../landing/Reveal'

const inputClass =
  'w-full rounded-lg border border-white/10 bg-[#0a1218]/90 px-4 py-3 text-[14px] text-slate-100 ' +
  'placeholder:text-slate-500 outline-none transition-colors focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20'

export function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <section id="contact" className="relative px-5 md:px-8 py-24 scroll-mt-16">
      <div className="max-w-[860px] mx-auto">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden border border-emerald-500/15">
            <AuroraMesh
              colors={['#04100b', '#071e15', '#0c3526', '#0d9468']}
              backgroundColor="#04100b"
              speed={0.22}
              grain={0.05}
              mouseInfluence={0.45}
              ripple
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-[#04090c]/55" />

            <div className="relative p-7 md:p-12">
              <div className="max-w-[520px] mb-9">
                <h2 className="font-display font-bold text-[clamp(28px,3.4vw,40px)] leading-[1.12] tracking-tight">
                  Bring us a hard problem.
                </h2>
                <p className="mt-3.5 text-[15px] text-slate-300 leading-relaxed">
                  We reply within one business day: what we'd try first, what it costs,
                  and whether the lab is the right fit.
                </p>
              </div>

              {sent ? (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mx-auto mb-5 text-emerald-400">
                    <Check size={24} />
                  </div>
                  <h3 className="font-display font-bold text-[20px] mb-2">Received.</h3>
                  <p className="text-[14px] text-slate-400 max-w-[380px] mx-auto leading-relaxed">
                    Thanks for the detail. You'll hear from the lab within one business day.
                  </p>
                </div>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="c-name" className="block text-[12px] font-semibold tracking-wide text-slate-300">
                        Your name
                      </label>
                      <input id="c-name" type="text" required className={inputClass} autoComplete="name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="c-email" className="block text-[12px] font-semibold tracking-wide text-slate-300">
                        Work email
                      </label>
                      <input id="c-email" type="email" required className={inputClass} autoComplete="email" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="c-brief" className="block text-[12px] font-semibold tracking-wide text-slate-300">
                      What should we explore?
                    </label>
                    <textarea
                      id="c-brief"
                      rows={5}
                      required
                      className={`${inputClass} resize-y min-h-[110px]`}
                      placeholder="The problem, the data you have, and what a win would look like."
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <a
                      href="mailto:hello@helitiva.com"
                      className="text-[13px] text-slate-400 hover:text-emerald-300 transition-colors"
                    >
                      or email hello@helitiva.com
                    </a>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] px-7 h-12 text-[14px] font-bold text-[#04130d] transition-all"
                    >
                      Send it to the lab <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
