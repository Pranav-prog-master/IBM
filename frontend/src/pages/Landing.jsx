import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/landing.css'

const Ico = ({ d, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true">{d}</svg>
)

const I = {
  book:    <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
  bulb:    <><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></>,
  globe:   <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
  mic:     <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>,
  chart:   <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  shield:  <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  wifi:    <><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></>,
  menu:    <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  x:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
}

const FEATURES = [
  { icon: 'bulb',   color: 'green',  title: 'AI-Powered Lessons',       desc: 'Gemini 1.5 Flash answers curriculum questions in simple language, grounded in NCERT content via RAG.' },
  { icon: 'chart',  color: 'blue',   title: 'Adaptive Quizzes',         desc: 'Bayesian Knowledge Tracing adjusts difficulty after every answer — easy, medium, or hard based on your mastery.' },
  { icon: 'globe',  color: 'yellow', title: 'Multilingual Support',     desc: 'Full UI in English, Hindi (Devanagari), and Gujarati. Voice input via Whisper STT in your language.' },
  { icon: 'mic',    color: 'purple', title: 'Voice Interaction',        desc: 'Speak your question — Whisper transcribes it locally on CPU. Get an audio answer back via gTTS.' },
  { icon: 'shield', color: 'red',    title: 'Privacy First',            desc: 'Presidio scrubs all PII before any LLM call. Your data stays in your own MongoDB instance.' },
  { icon: 'wifi',   color: 'teal',   title: 'Works Offline',            desc: 'PWA with Workbox caching. Quiz answers queue in IndexedDB and sync automatically when back online.' },
]

const PARTNERS = ['NCERT', 'DIKSHA', 'Khan Academy', 'CK-12', 'IBM', 'Google AI']

const STATS = [
  { num: '6–10',  label: 'Grades supported' },
  { num: '3',     label: 'Indian languages' },
  { num: '100%',  label: 'Curriculum-grounded' },
  { num: 'Free',  label: 'Open source · MIT' },
]

/* Scroll fade-up observer */
function useFadeUp() {
  const ref = useRef(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.fade-up') || []
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

export default function LandingPage() {
  const navigate = useNavigate()
  const pageRef  = useFadeUp()

  return (
    <div ref={pageRef}>
      {/* ── Navbar ── */}
      <nav className="land-nav" aria-label="Main navigation">
        <a href="#hero" className="land-nav-logo" aria-label="AI Tutor home">
          <div className="land-nav-logo-icon"><Ico d={I.book} size={20} /></div>
          <span className="land-nav-logo-text">AI Tutor</span>
        </a>

        <ul className="land-nav-links" role="list">
          <li><a href="#features">Features</a></li>
          <li><a href="#stats">Impact</a></li>
          <li><a href="#cta">Get Started</a></li>
        </ul>

        <div className="land-nav-actions">
          <button className="land-btn-ghost" onClick={() => navigate('/login')}>Log In</button>
          <button className="land-btn-solid" onClick={() => navigate('/login?mode=register')}>Sign up</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="hero" className="land-hero" aria-labelledby="hero-h1">
        <div className="land-hero-blob"    aria-hidden="true" />
        <div className="land-hero-blob-2"  aria-hidden="true" />

        <div className="land-hero-inner">
          {/* Decorative ornament — inspired by Sarvam's Indian motif */}
          <svg className="land-ornament" width="120" height="40" viewBox="0 0 120 40"
            fill="none" aria-hidden="true">
            <path d="M10 20 Q20 5 30 20 Q40 35 50 20 Q60 5 70 20 Q80 35 90 20 Q100 5 110 20"
              stroke="#1F4D3A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
            <circle cx="10"  cy="20" r="2.5" fill="#F4B400" opacity="0.7"/>
            <circle cx="60"  cy="20" r="3"   fill="#1F4D3A" opacity="0.5"/>
            <circle cx="110" cy="20" r="2.5" fill="#F4B400" opacity="0.7"/>
          </svg>

          <span className="land-hero-tag">India's AI Tutor for Every Student</span>

          <h1 className="land-hero-h1" id="hero-h1">
            AI for every<br />student in India
          </h1>

          <p className="land-hero-sub">
            Built on open curriculum. Powered by Gemini 1.5 Flash.<br />
            Delivering personalised learning at population scale.
          </p>

          <div className="land-hero-cta">
            <button className="land-btn-solid" onClick={() => navigate('/login?mode=register')}>
              Sign up free
            </button>
            <a href="#features" className="land-btn-ghost">
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="land-partners" aria-label="Content partners">
        <p className="land-partners-label">Curriculum content from</p>
        <div className="land-partners-logos" role="list">
          {PARTNERS.map(p => (
            <span key={p} className="land-partner-logo" role="listitem">{p}</span>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="land-features" aria-labelledby="feat-h2">
        <div style={{ maxWidth: 800 }}>
          <span className="land-section-tag fade-up">What's inside</span>
          <h2 className="land-section-h2 fade-up" id="feat-h2">
            Everything a student needs to learn better
          </h2>
          <p className="land-section-sub fade-up">
            From adaptive quizzes to voice interaction — every feature is designed for low-bandwidth, low-end devices in rural India.
          </p>
        </div>
        <div className="land-features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="land-feature-card fade-up"
              style={{ transitionDelay: `${i * 80}ms` }}>
              <div className={`land-feature-icon ${f.color}`}>
                <Ico d={I[f.icon]} size={22} />
              </div>
              <h3 className="land-feature-title">{f.title}</h3>
              <p className="land-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="land-stats" aria-label="Impact statistics">
        {STATS.map(s => (
          <div key={s.label} className="fade-up">
            <div className="land-stat-num">{s.num}</div>
            <div className="land-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="land-cta-section" aria-labelledby="cta-h2">
        <span className="land-section-tag fade-up">Get started today</span>
        <h2 className="land-cta-h2 fade-up" id="cta-h2">
          Start learning smarter, right now
        </h2>
        <p className="land-cta-sub fade-up">
          Free forever. No credit card. Works on any Android phone, even offline.
        </p>
        <div className="land-hero-cta fade-up">
          <button className="land-btn-solid" onClick={() => navigate('/login?mode=register')}>
            Create free account
          </button>
          <button className="land-btn-ghost" onClick={() => navigate('/login')}>
            Sign in
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="land-footer" aria-label="Site footer">
        <div className="land-footer-logo">AI Tutor</div>
        <ul className="land-footer-links" role="list">
          <li><a href="#features">Features</a></li>
          <li><a href="#stats">Impact</a></li>
          <li><a href="https://ncert.nic.in" target="_blank" rel="noreferrer">NCERT</a></li>
          <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
        <p className="land-footer-copy">
          © {new Date().getFullYear()} AI Tutor · MIT License
        </p>
      </footer>
    </div>
  )
}
