import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { login, register } from '../api'
import '../styles/tokens.css'
import '../styles/login.css'

const Ico = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true">{d}</svg>
)

const I = {
  book:   <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
  user:   <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  lock:   <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  eye:    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  eyeOff: <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>,
  check:  <polyline points="20 6 9 17 4 12"/>,
  alert:  <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
  bulb:   <><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></>,
  star:   <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  globe:  <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
  chart:  <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
}

function parseError(err) {
  if (!err.response) return 'Cannot reach the server. Make sure the backend is running on port 8000.'
  const { status, data } = err.response
  const detail = data?.detail
  if (status === 400) return detail || 'Username is already taken.'
  if (status === 401) return 'Incorrect username or password.'
  if (status === 422) return 'Please fill in all required fields correctly.'
  if (status >= 500) return 'Server error. Please try again in a moment.'
  return detail || 'Something went wrong. Please try again.'
}

const FEATURES = [
  { icon: 'bulb',  text: 'AI-powered lessons grounded in NCERT curriculum' },
  { icon: 'star',  text: 'Adaptive quizzes that match your skill level' },
  { icon: 'globe', text: 'Supports English, Hindi & Gujarati' },
  { icon: 'chart', text: 'Track mastery with visual progress reports' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode,    setMode]    = useState(searchParams.get('mode') === 'register' ? 'register' : 'login')
  const [form,    setForm]    = useState({ username: '', password: '', grade: '7', language: 'en' })
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const switchMode = m => { setMode(m); setError(''); setSuccess('') }

  const handleSubmit = async e => {
    e.preventDefault()
    if (loading) return
    setError(''); setSuccess('')
    if (!form.username.trim()) { setError('Username is required.'); return }
    if (form.password.length < 4) { setError('Password must be at least 4 characters.'); return }
    setLoading(true)
    try {
      if (mode === 'register') {
        await register({ username: form.username.trim(), password: form.password, grade: form.grade, language: form.language })
        setSuccess('Account created! Signing you in…')
      }
      await login(form.username.trim(), form.password)
      localStorage.setItem('lang',     form.language)
      localStorage.setItem('username', form.username.trim())
      localStorage.setItem('grade',    form.grade)
      navigate('/dashboard')
    } catch (err) {
      setError(parseError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left branding panel */}
      <div className="auth-left" aria-hidden="true">
        <div className="auth-brand-logo">
          <Ico d={I.book} size={28} />
        </div>
        <h1 className="auth-brand-title">AI Tutor<br />for Rural Education</h1>
        <p className="auth-brand-desc">
          Personalised learning for students in grades 6–10, powered by AI and grounded in the NCERT curriculum.
        </p>
        <div className="auth-features-list">
          {FEATURES.map(f => (
            <div key={f.text} className="auth-feature-item">
              <div className="auth-feature-dot"><Ico d={I[f.icon]} size={16} /></div>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Mobile logo */}
          <div className="auth-mobile-logo">
            <div className="auth-mobile-logo-icon"><Ico d={I.book} size={22} /></div>
            <span className="auth-mobile-logo-text">AI Tutor</span>
          </div>

          <h2 className="auth-heading">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="auth-subheading">
            {mode === 'login' ? 'Sign in to continue your learning journey.' : 'Join and start learning smarter today.'}
          </p>

          {/* Tabs */}
          <div className="auth-tabs" role="tablist" aria-label="Sign in or Register">
            {[['login','Sign In'],['register','Register']].map(([m, label]) => (
              <button key={m} role="tab"
                className={`auth-tab${mode === m ? ' active' : ''}`}
                aria-selected={mode === m}
                onClick={() => switchMode(m)}>
                {label}
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-user">Username</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Ico d={I.user} size={16} /></span>
                <input id="auth-user" className="auth-input" type="text"
                  autoComplete={mode === 'login' ? 'username' : 'new-username'}
                  placeholder="e.g. arjun_sharma"
                  value={form.username} onChange={set('username')}
                  required aria-required="true"
                  aria-describedby={error ? 'auth-err' : undefined} />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-pass">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Ico d={I.lock} size={16} /></span>
                <input id="auth-pass" className="auth-input"
                  type={showPw ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder={mode === 'register' ? 'Min. 4 characters' : 'Your password'}
                  value={form.password} onChange={set('password')}
                  required aria-required="true" />
                <button type="button" className="pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  aria-pressed={showPw}>
                  <Ico d={showPw ? I.eyeOff : I.eye} size={16} />
                </button>
              </div>
            </div>

            {/* Register extras */}
            {mode === 'register' && (
              <div className="auth-row-2">
                <div className="auth-field">
                  <label className="auth-label" htmlFor="auth-grade">Grade</label>
                  <select id="auth-grade" className="auth-select" value={form.grade} onChange={set('grade')}>
                    {['6','7','8','9','10'].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="auth-lang">Language</label>
                  <select id="auth-lang" className="auth-select" value={form.language} onChange={set('language')}>
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="gu">ગુજરાતી</option>
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div id="auth-err" className="auth-error" role="alert" aria-live="assertive">
                <Ico d={I.alert} size={16} /><span>{error}</span>
              </div>
            )}
            {success && (
              <div className="auth-success" role="status" aria-live="polite">
                <Ico d={I.check} size={16} /><span>{success}</span>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading} aria-busy={loading}>
              {loading
                ? <><div className="auth-spinner" aria-hidden="true" />{mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            {mode === 'login'
              ? <>No account? <button className="auth-link" onClick={() => switchMode('register')}>Register free →</button></>
              : <>Have an account? <button className="auth-link" onClick={() => switchMode('login')}>Sign in →</button></>}
          </p>
        </div>
      </div>
    </div>
  )
}
