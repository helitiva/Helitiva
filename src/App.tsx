import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { CyberLogo } from './components/CyberLogo';
import { ActiveTerminal } from './components/ActiveTerminal';
import { BillingWidget } from './components/BillingWidget';
import { ChatbotWidget } from './components/ChatbotWidget';
import { SchedulerWidget } from './components/SchedulerWidget';
import { SeoWidget } from './components/SeoWidget';
import { EstimatorForm } from './components/EstimatorForm';
import SparkleNavbar from './components/lightswind/sparkle-navbar';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/lightswind/accordion';

/* ── Animated counter ───────────────────────────────────── */
const Counter: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let s = 0; const step = to / 50;
      const t = setInterval(() => { s += step; if (s >= to) { setN(to); clearInterval(t); } else setN(Math.floor(s)); }, 20);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
};

/* ── Mini bar chart ──────────────────────────────────────── */
const BarChart: React.FC<{ data: number[]; accent?: string }> = ({ data, accent = '#00d4a8' }) => {
  const mx = Math.max(...data);
  return (
    <div className="bar-chart" style={{ height: 48 }}>
      {data.map((v, i) => (
        <div key={i} className="bar-chart-bar"
          style={{ height: `${(v / mx) * 100}%`, background: i === data.indexOf(mx) ? accent : `${accent}25` }} />
      ))}
    </div>
  );
};

/* ── Ring metric ─────────────────────────────────────────── */
const Ring: React.FC<{ pct: number; val: string; unit?: string; label: string; sz?: number }> = ({
  pct, val, unit = '', label, sz = 80,
}) => {
  const r = (sz - 8) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: sz, height: sz }}>
        <svg width={sz} height={sz} className="ring-svg">
          <circle className="ring-track" cx={sz / 2} cy={sz / 2} r={r} strokeWidth={2} />
          <circle className="ring-fill" cx={sz / 2} cy={sz / 2} r={r} strokeWidth={2}
            strokeDasharray={c} strokeDashoffset={off}
            style={{ '--ring-offset': off } as React.CSSProperties} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 700, lineHeight: 1 }}>{val}</span>
          {unit && <span style={{ fontSize: 8, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em' }}>{unit}</span>}
        </div>
      </div>
      <span className="label-muted" style={{ fontSize: 8 }}>{label}</span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const MainApp: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const handleNavSelect = (i: number) => scrollTo(['services', 'why-labs', 'cases', 'contact'][i]);

  const techStack = [
    { name: 'Next.js', icon: 'fab fa-react', c: '#61dafb' },
    { name: 'LangChain', icon: 'fas fa-link', c: '#00d4a8' },
    { name: 'OpenAI', icon: 'fas fa-brain', c: '#a855f7' },
    { name: 'FastAPI', icon: 'fas fa-bolt', c: '#00d4a8' },
    { name: 'PostgreSQL', icon: 'fas fa-database', c: '#336791' },
    { name: 'Docker', icon: 'fab fa-docker', c: '#2496ed' },
    { name: 'AWS', icon: 'fab fa-aws', c: '#ff9900' },
    { name: 'Tailwind', icon: 'fas fa-wind', c: '#06b6d4' },
  ];

  const testimonials = [
    { name: 'Alex Morgan', role: 'CTO @ FlowSaaS', av: 'AM', q: 'Helitiva shipped our billing SaaS in 4 weeks. Zero technical debt handed over.' },
    { name: 'Thu Nguyen', role: 'Founder @ DocuAgent', av: 'TN', q: 'RAG agent with custom vector search. Response latency dropped 80%.' },
    { name: 'James Park', role: 'Growth Lead @ RankPulse', av: 'JP', q: 'Programmatic SEO at scale. 50k+ pages in 3 weeks. Organic traffic tripled.' },
    { name: 'Linh Tran', role: 'Founder @ ApexOps', av: 'LT', q: 'Full-stack automation platform. Sprint model kept us in the loop every step.' },
    { name: 'David Chen', role: 'CEO @ VectorDB', av: 'DC', q: 'Best engineers I\'ve worked with. They understand product, not just code.' },
    { name: 'Sofia Rossi', role: 'PM @ CloudScale', av: 'SR', q: 'Multi-tenant infra handles 100k+ concurrent users. Enterprise-grade.' },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* ═══ TOPOGRAPHIC SATELLITE BACKGROUND ═══ */}
      <div className="topo-bg" />

      {/* ═══ NAV ═══════════════════════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50, height: 52,
        background: 'rgba(4, 10, 6, 0.70)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <CyberLogo size={22} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--text)' }}>
              HELITIVA<span style={{ color: 'var(--accent)' }}>.</span>
            </span>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div className="hidden-mobile">
              <SparkleNavbar items={[t.nav.services, t.nav.why, t.nav.cases, t.nav.contact]} color="#00d4a8" onSelect={handleNavSelect} />
            </div>
            <div style={{ display: 'flex', border: '1px solid var(--border-md)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              {(['en', 'vi'] as const).map((l) => (
                <button key={l} onClick={() => setLanguage(l)} style={{
                  padding: '4px 12px', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const, cursor: 'pointer', border: 'none',
                  background: language === l ? 'var(--accent)' : 'transparent',
                  color: language === l ? '#040a06' : 'var(--text-30)',
                  transition: 'all 0.15s',
                }}>{l}</button>
              ))}
            </div>
            <button onClick={() => scrollTo('contact')} className="btn btn-primary" style={{ padding: '7px 18px', fontSize: 9 }}>
              {t.nav.cta}
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 52px)', display: 'flex', alignItems: 'center', padding: '80px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
            {/* Left copy */}
            <div>
              <div className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', marginBottom: 28, borderRadius: 'var(--radius)' }}>
                <span className="live-dot" />
                <span className="label" style={{ fontSize: 9 }}>{t.hero.indicator}</span>
              </div>

              <h1 style={{ fontSize: 'clamp(44px, 6vw, 78px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', marginBottom: 20 }}>
                <span style={{ color: 'var(--text)', display: 'block' }}>We build digital</span>
                <span className="shimmer-text" style={{ display: 'block' }}>products.</span>
                <span style={{ color: 'var(--text-30)', display: 'block', fontSize: '0.5em', fontWeight: 500, letterSpacing: '-0.01em', marginTop: 6 }}>Not just code.</span>
              </h1>

              <p style={{ fontSize: 15, color: 'var(--text-50)', lineHeight: 1.8, maxWidth: '44ch', marginBottom: 36 }}>{t.hero.desc}</p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                <button onClick={() => scrollTo('contact')} className="btn btn-primary">
                  {t.hero.cta_estim} <i className="fas fa-arrow-right" style={{ fontSize: 9 }} />
                </button>
                <button onClick={() => scrollTo('services')} className="btn btn-ghost">
                  {t.hero.cta_demo}
                </button>
              </div>

              <p style={{ fontSize: 11, color: 'var(--text-30)', letterSpacing: '0.06em' }}>
                <i className="fas fa-shield-halved" style={{ color: 'var(--accent-dim)', marginRight: 6 }} />
                {t.hero.trust}
              </p>
            </div>

            {/* Right: floating glass terminal */}
            <div className="float-anim" style={{ position: 'relative' }}>
              {/* Ambient glow behind terminal */}
              <div style={{ position: 'absolute', inset: '-60px', background: 'radial-gradient(ellipse, rgba(0,212,168,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

              <div className="glass glass-inner-shine scan-wrap" style={{ overflow: 'hidden', position: 'relative' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="label" style={{ fontSize: 9 }}>SYSTEM TERMINAL</span>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#e05757' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#e0b257' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
                  </div>
                </div>
                <ActiveTerminal />
              </div>

              {/* Floating data callouts */}
              <div className="glass-teal glass-inner-shine" style={{ position: 'absolute', top: -22, right: -28, padding: '10px 14px', minWidth: 105 }}>
                <p className="label-muted" style={{ fontSize: 8, marginBottom: 3 }}>SPRINTS</p>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>40<span style={{ fontSize: 11, color: 'var(--text-30)' }}>+</span></p>
              </div>
              <div className="glass glass-inner-shine" style={{ position: 'absolute', bottom: -18, left: -24, padding: '10px 14px' }}>
                <p className="label-muted" style={{ fontSize: 8, marginBottom: 3 }}>UPTIME</p>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 17, fontWeight: 700, lineHeight: 1 }}>99.9<span style={{ fontSize: 9, color: 'var(--text-30)' }}>%</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ════════════════════════════════════ */}
      <section style={{
        position: 'relative', zIndex: 1, padding: '24px 0',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        background: 'rgba(4,10,6,0.50)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      }}>
        <div className="container">
          <p className="label-muted" style={{ textAlign: 'center', marginBottom: 16, fontSize: 9 }}>{t.trustbar.label}</p>
          <div className="marquee" style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' }}>
            <div className="marquee-track" style={{ display: 'flex', gap: 48, alignItems: 'center', width: 'max-content' }}>
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Nvidia', 'Netflix', 'Cisco', 'Shopify', 'Stripe',
                'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Nvidia', 'Netflix', 'Cisco', 'Shopify', 'Stripe'].map((c, i) => (
                <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--text-15)', whiteSpace: 'nowrap', textTransform: 'uppercase' as const }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS PANELS ═════════════════════════════════ */}
      <section className="section--sm" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { val: 40, suf: '+', label: t.stats.shipped, delta: '+12 this year', color: 'var(--accent)', chart: [5,8,12,15,18,22,28,33,35,40] },
              { val: 50, suf: '+', label: t.stats.ai, delta: '+8 this year', color: '#a855f7', chart: [2,5,8,12,18,25,32,40,45,50] },
              { val: 120, suf: '+', label: t.stats.automations, delta: 'active now', color: '#c8a96e', chart: [20,35,50,65,75,85,95,105,115,120] },
              { val: 4200000, suf: '+', label: t.stats.traffic, delta: 'visits driven', color: '#38bdf8', chart: [100,250,500,800,1200,1800,2500,3200,3800,4200] },
            ].map((s, i) => (
              <div key={i} className="glass glass-inner-shine glass-accent-left" style={{ padding: '20px', borderLeftColor: s.color }}>
                <p className="label-muted" style={{ marginBottom: 10, fontSize: 9 }}>{s.label}</p>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 30, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 3 }}>
                  <Counter to={s.val} suffix={s.suf} />
                </p>
                <p style={{ fontSize: 10, color: 'var(--text-30)', marginBottom: 12 }}>{s.delta}</p>
                <BarChart data={s.chart} accent={s.color} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES (Glass bento) ═══════════════════════ */}
      <section id="services" className="section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div className="section-badge" style={{ marginBottom: 14 }}>{t.services.subtitle}</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>{t.services.title}</h2>
            <p style={{ fontSize: 14, color: 'var(--text-30)', maxWidth: '56ch', lineHeight: 1.7 }}>{t.services.desc}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { tag: t.webapp.role, tagC: 'var(--accent)', title: t.webapp.title, desc: t.webapp.desc, widget: <BillingWidget /> },
              { tag: t.ai.role, tagC: '#a855f7', title: t.ai.title, desc: t.ai.desc, widget: <ChatbotWidget /> },
              { tag: t.marketing.role, tagC: '#c8a96e', title: t.marketing.title, desc: t.marketing.desc, widget: <SchedulerWidget /> },
              { tag: t.seo.role, tagC: '#38bdf8', title: t.seo.title, desc: t.seo.desc, widget: <SeoWidget /> },
            ].map((s, i) => (
              <div key={i} className="glass glass-inner-shine scan-wrap" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <span className="label" style={{ color: s.tagC, display: 'block', marginBottom: 8, fontSize: 9 }}>{s.tag}</span>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, letterSpacing: '-0.01em' }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-30)', lineHeight: 1.65 }}>{s.desc}</p>
                </div>
                <div style={{ flex: 1 }}>{s.widget}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TECH STACK ═══════════════════════════════════ */}
      <section style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: '36px 0',
        background: 'rgba(4,10,6,0.40)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
            <p className="label-muted" style={{ flexShrink: 0, fontSize: 9 }}>TECH STACK</p>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {techStack.map((t) => (
                <div key={t.name} className="glass" style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', cursor: 'default',
                }}>
                  <i className={t.icon} style={{ color: t.c, fontSize: 12 }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-50)', letterSpacing: '0.05em' }}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROCESS ══════════════════════════════════════ */}
      <section id="why-labs" className="section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 56, alignItems: 'start' }}>
            {/* Sticky sidebar */}
            <div style={{ position: 'sticky', top: 76 }}>
              <div className="section-badge" style={{ marginBottom: 14 }}>{t.steps.tag}</div>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>{t.steps.title}</h2>
              <p style={{ fontSize: 13, color: 'var(--text-30)', lineHeight: 1.7, marginBottom: 24 }}>{t.steps.desc}</p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Ring pct={98} val="98" unit="%" label="ON-TIME" />
                <Ring pct={94} val="94" unit="%" label="RETENTION" />
                <Ring pct={100} val="100" unit="%" label="IP XFER" />
              </div>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { n: '01', title: t.steps.step1, desc: t.steps.step1_desc },
                { n: '02', title: t.steps.step2, desc: t.steps.step2_desc },
                { n: '03', title: t.steps.step3, desc: t.steps.step3_desc },
                { n: '04', title: t.steps.step4, desc: t.steps.step4_desc },
              ].map((s, i, a) => (
                <div key={i} style={{ display: 'flex', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="glass-teal" style={{
                      width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent)', flexShrink: 0,
                    }}>{s.n}</div>
                    {i < a.length - 1 && <div style={{ flex: 1, width: 1, minHeight: 36, background: 'var(--border-md)' }} />}
                  </div>
                  <div style={{ paddingTop: 6, paddingBottom: i < a.length - 1 ? 28 : 0 }}>
                    <p className="label-muted" style={{ marginBottom: 4, fontSize: 9 }}>{s.title}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-30)', lineHeight: 1.65 }}>{s.desc}</p>
                  </div>
                </div>
              ))}

              <div className="glass-teal glass-inner-shine" style={{ marginTop: 28, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <i className="fas fa-certificate" style={{ color: 'var(--accent)', fontSize: 16 }} />
                <p style={{ fontSize: 12, color: 'var(--text-50)', lineHeight: 1.5 }}>
                  Every project ships with <strong style={{ color: 'var(--accent)' }}>100% IP ownership</strong>, full source handover, and <strong style={{ color: 'var(--accent)' }}>30 days</strong> free support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CASE STUDIES ═════════════════════════════════ */}
      <section id="cases" className="section" style={{ position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div className="section-badge" style={{ marginBottom: 14 }}>{t.cases.tag}</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>{t.cases.title}</h2>
            <p style={{ fontSize: 14, color: 'var(--text-30)', maxWidth: '56ch', lineHeight: 1.7 }}>{t.cases.desc}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 12 }}>
            {[
              { tag: t.cases.card1_tag, time: t.cases.card1_time, title: t.cases.card1_title, desc: t.cases.card1_desc, metric: '4', unit: 'WKS', lbl: 'to production', color: 'var(--accent)' },
              { tag: t.cases.card2_tag, time: t.cases.card2_time, title: t.cases.card2_title, desc: t.cases.card2_desc, metric: '−80', unit: '%', lbl: 'latency', color: '#a855f7' },
              { tag: t.cases.card3_tag, time: t.cases.card3_time, title: t.cases.card3_title, desc: t.cases.card3_desc, metric: '3×', unit: '', lbl: 'organic traffic', color: '#38bdf8' },
            ].map((c, i) => (
              <div key={i} className="glass glass-inner-shine glass-accent-left" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, borderLeftColor: c.color }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="label" style={{ color: c.color, fontSize: 9 }}>{c.tag}</span>
                  <span className="label-muted" style={{ fontSize: 8 }}>{c.time}</span>
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{c.title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-30)', lineHeight: 1.6 }}>{c.desc}</p>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 34, fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.metric}</span>
                  {c.unit && <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: c.color, opacity: 0.6 }}>{c.unit}</span>}
                  <span className="label-muted" style={{ fontSize: 8, marginLeft: 4 }}>{c.lbl}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary panel */}
          <div className="glass glass-inner-shine" style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr auto', gap: 28, alignItems: 'center' }}>
            <div>
              <p className="label-muted" style={{ marginBottom: 14, fontSize: 9 }}>DELIVERY TIMELINE — 6 MONTH VIEW</p>
              <BarChart data={[12, 28, 18, 42, 35, 58, 45, 72, 61, 88, 76, 95]} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { v: '12', u: 'DAYS', l: 'Avg prototype', c: 'var(--accent)' },
                { v: '94', u: '%', l: 'Retention', c: '#c8a96e' },
                { v: '98', u: '%', l: 'On-time', c: '#38bdf8' },
                { v: '18', u: '+', l: 'Countries', c: '#a855f7' },
              ].map((m, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700, color: m.c }}>{m.v}<span style={{ fontSize: 10, opacity: 0.5 }}>{m.u}</span></p>
                  <p className="label-muted" style={{ fontSize: 8, marginTop: 2 }}>{m.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═════════════════════════════════ */}
      <section className="section" style={{ position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div className="section-badge" style={{ marginBottom: 14 }}>CLIENT VOICES</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, letterSpacing: '-0.02em' }}>Trusted by founders & engineers.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="glass glass-inner-shine" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <i key={s} className="fas fa-star" style={{ color: 'var(--amber)', fontSize: 9 }} />
                  ))}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-50)', lineHeight: 1.7, fontStyle: 'italic' }}>"{t.q}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 'var(--radius)',
                    background: 'var(--glass-teal)', border: '1px solid var(--border-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: 'var(--accent)',
                  }}>{t.av}</div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600 }}>{t.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-30)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ══════════════════════════════════════════ */}
      <section className="section" style={{ position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ marginBottom: 48 }}>
            <div className="section-badge" style={{ marginBottom: 14 }}>{t.faq.tag}</div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{t.faq.title}</h2>
            <p style={{ fontSize: 14, color: 'var(--text-30)' }}>{t.faq.desc}</p>
          </div>

          <Accordion type="single" collapsible={true} className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: 6 } as React.CSSProperties}>
            {[
              { id: 'f1', q: t.faq.q1, a: t.faq.a1 }, { id: 'f2', q: t.faq.q2, a: t.faq.a2 },
              { id: 'f3', q: t.faq.q3, a: t.faq.a3 }, { id: 'f4', q: t.faq.q4, a: t.faq.a4 },
              { id: 'f5', q: t.faq.q5, a: t.faq.a5 }, { id: 'f6', q: t.faq.q6, a: t.faq.a6 },
            ].map((item) => (
              <AccordionItem value={item.id} key={item.id} style={{
                background: 'var(--glass)', backdropFilter: 'blur(var(--blur))', WebkitBackdropFilter: 'blur(var(--blur))',
                border: '1px solid var(--border-md)', borderRadius: 'var(--radius)', padding: '0 18px', overflow: 'hidden',
              }}>
                <AccordionTrigger style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-50)', textAlign: 'left', padding: '14px 0' }} className="hover:text-white hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent style={{ fontSize: 13, color: 'var(--text-30)', lineHeight: 1.7, paddingBottom: 14 }}>
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ═══ CTA + FORM ══════════════════════════════════ */}
      <section id="contact" className="section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="glass-teal glass-inner-shine scan-wrap" style={{
            padding: '56px 40px', textAlign: 'center', marginBottom: 48,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,212,168,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <div className="section-badge" style={{ marginBottom: 18 }}>{t.form.tag}</div>
            <h2 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 10 }}>{t.form.title}</h2>
            <p style={{ fontSize: 15, color: 'var(--text-30)', maxWidth: '46ch', margin: '0 auto 28px' }}>{t.form.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => document.getElementById('form-area')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary">
                START SCOPING <i className="fas fa-arrow-right" style={{ fontSize: 9 }} />
              </button>
              <a href="mailto:hello@helitiva.com" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
                <i className="fas fa-envelope" /> hello@helitiva.com
              </a>
            </div>
          </div>
          <div id="form-area" style={{ maxWidth: 620, margin: '0 auto' }}><EstimatorForm /></div>
        </div>
      </section>

      {/* ═══ FOOTER ═══════════════════════════════════════ */}
      <footer style={{
        position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)', padding: '44px 0',
        background: 'rgba(4,10,6,0.70)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 28, marginBottom: 36 }}>
            <div>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 10 }}>
                <CyberLogo size={18} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>HELITIVA<span style={{ color: 'var(--accent)' }}>.</span></span>
              </a>
              <p style={{ fontSize: 12, color: 'var(--text-30)', lineHeight: 1.65, marginBottom: 14 }}>{t.footer.tagline}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['fab fa-github', 'fab fa-linkedin', 'fab fa-twitter'].map((ic, i) => (
                  <a key={i} href="#" className="glass" style={{
                    width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-30)', textDecoration: 'none', fontSize: 10,
                  }}><i className={ic} /></a>
                ))}
              </div>
            </div>
            {[
              { title: t.footer.services_header, links: [t.form.step1_opt1, t.form.step1_opt2, t.form.step1_opt3, t.form.step1_opt4] },
              { title: t.footer.pipeline_header, links: [t.nav.why, t.nav.cases, t.nav.contact] },
              { title: 'Legal', links: [t.footer.privacy, t.footer.terms, t.footer.sitemap] },
            ].map((col) => (
              <div key={col.title}>
                <p className="label-muted" style={{ marginBottom: 14, fontSize: 9 }}>{col.title}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.links.map((l) => (
                    <li key={l}><a href="#" style={{ fontSize: 12, color: 'var(--text-30)', textDecoration: 'none' }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="divider" style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontSize: 10, color: 'var(--text-30)', letterSpacing: '0.04em' }}>{t.footer.copyright}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="live-dot" style={{ width: 5, height: 5 }} />
              <span style={{ fontSize: 9, color: 'var(--text-30)', letterSpacing: '0.1em', fontFamily: 'var(--mono)' }}>ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"] { display: flex !important; flex-direction: column !important; }
          div[style*="grid-template-columns: repeat(3,1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="grid-template-columns: repeat(4,1fr)"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="grid-template-columns: 280px 1fr"] { display: flex !important; flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => (<LanguageProvider><MainApp /></LanguageProvider>);
export default App;
