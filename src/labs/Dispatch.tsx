import { useState } from 'react'
import { Check, Send } from 'lucide-react'
import { Reveal } from '../landing/Reveal'

export function Dispatch() {
  const [done, setDone] = useState(false)

  return (
    <section className="relative px-5 md:px-8 py-14">
      <div className="max-w-[1120px] mx-auto">
        <Reveal>
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] px-6 md:px-8 py-7 flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-[460px]">
              <h2 className="font-display font-bold text-[20px] mb-1.5">The dispatch.</h2>
              <p className="text-[13.5px] text-slate-400 leading-relaxed">
                One email when something graduates or dies. No drip campaigns.
              </p>
            </div>
            {done ? (
              <div className="flex items-center gap-2.5 text-emerald-300 text-[14px] font-semibold">
                <Check size={16} /> You're on the list.
              </div>
            ) : (
              <form
                className="flex flex-wrap gap-2.5"
                onSubmit={(e) => {
                  e.preventDefault()
                  setDone(true)
                }}
              >
                <label htmlFor="dispatch-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="dispatch-email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-[240px] rounded-full border border-white/10 bg-[#0a1218]/90 px-5 py-2.5 text-[13.5px] text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] px-5 py-2.5 text-[13.5px] font-bold text-[#04130d] transition-all"
                >
                  Subscribe <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
