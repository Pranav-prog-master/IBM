import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import '../styles/tokens.css'
import '../styles/settings.css'

const Ico = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true">{d}</svg>
)
const I = {
  user:  <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
  bell:  <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></>,
  check: <polyline points="20 6 9 17 4 12"/>,
  save:  <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
}

function SettingSection({ title, icon, children }) {
  return (
    <div className="setting-section">
      <div className="setting-section-header">
        <Ico d={I[icon]} size={18} />
        <h3 className="setting-section-title">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle-wrap" aria-label={label}>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`toggle-track${checked ? ' on' : ''}`} aria-hidden="true">
        <div className="toggle-thumb" />
      </div>
      <span className="toggle-label">{label}</span>
    </label>
  )
}

export default function SettingsPage() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [grade,    setGrade]    = useState(localStorage.getItem('grade')    || '7')
  const [lang,     setLang]     = useState(localStorage.getItem('lang')     || 'en')
  const [notifQuiz,  setNotifQuiz]  = useState(true)
  const [notifStreak,setNotifStreak]= useState(true)
  const [saved, setSaved] = useState(false)

  const saveProfile = () => {
    localStorage.setItem('username', username)
    localStorage.setItem('grade',    grade)
    localStorage.setItem('lang',     lang)
    i18n.changeLanguage(lang)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const clearData = () => {
    if (!window.confirm('This will delete all your saved tasks and progress. Are you sure?')) return
    localStorage.removeItem('ai-tutor-tasks')
    localStorage.removeItem('ai-tutor-points')
    navigate('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('grade')
    navigate('/login')
  }

  return (
    <Layout title="Settings">
      <div className="settings-grid">

        <SettingSection title="Profile" icon="user">
          <div className="setting-field">
            <label className="setting-label" htmlFor="s-username">Display Name</label>
            <input id="s-username" className="neu-input" type="text"
              value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Your name" />
          </div>
          <div className="setting-field">
            <label className="setting-label" htmlFor="s-grade">Grade</label>
            <select id="s-grade" className="neu-input setting-select"
              value={grade} onChange={e => setGrade(e.target.value)}>
              {['6','7','8','9','10'].map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </div>
          <button className="btn btn-primary setting-save" onClick={saveProfile}>
            <Ico d={I.save} size={16} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
          {saved && (
            <div className="setting-success" role="status">
              <Ico d={I.check} size={14} /> Profile saved successfully
            </div>
          )}
        </SettingSection>

        <SettingSection title="Language" icon="globe">
          <p className="setting-desc">Choose the language for the app interface.</p>
          <div className="lang-options">
            {[['en','English','English'],['hi','हिंदी','Hindi'],['gu','ગુજરાતી','Gujarati']].map(([code, native, english]) => (
              <button key={code}
                className={`lang-option${lang === code ? ' active' : ''}`}
                onClick={() => { setLang(code); i18n.changeLanguage(code); localStorage.setItem('lang', code) }}
                aria-pressed={lang === code}>
                <span className="lang-option-native">{native}</span>
                <span className="lang-option-english">{english}</span>
                {lang === code && <Ico d={I.check} size={14} />}
              </button>
            ))}
          </div>
        </SettingSection>

        <SettingSection title="Notifications" icon="bell">
          <div className="setting-toggles">
            <Toggle checked={notifQuiz}   onChange={e => setNotifQuiz(e.target.checked)}   label="Quiz reminders" />
            <Toggle checked={notifStreak} onChange={e => setNotifStreak(e.target.checked)} label="Daily streak alerts" />
          </div>
        </SettingSection>

        <SettingSection title="Account" icon="trash">
          <p className="setting-desc">Danger zone — these actions cannot be undone.</p>
          <div className="setting-danger-btns">
            <button className="btn-danger-outline" onClick={clearData}>
              <Ico d={I.trash} size={16} /> Clear all saved data
            </button>
            <button className="btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </SettingSection>

      </div>
    </Layout>
  )
}
