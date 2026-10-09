import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/tokens.css'
import '../styles/app.css'

const Ico = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true">{d}</svg>
)

const I = {
  home:     <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  tasks:    <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
  ai:       <><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></>,
  quiz:     <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  progress: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  book:     <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
  logout:   <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  menu:     <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  bell:     <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  wifi:     <><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></>,
}

const NAV = [
  { path: '/dashboard', icon: 'home',     label: 'Dashboard' },
  { path: '/home',      icon: 'ai',       label: 'AI Tutor',  badge: 'AI' },
  { path: '/quiz',      icon: 'quiz',     label: 'Quiz' },
  { path: '/progress',  icon: 'progress', label: 'Progress' },
  { path: '/settings',  icon: 'settings', label: 'Settings' },
]

export default function Layout({ children, title }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { i18n }  = useTranslation()
  const [open, setOpen] = useState(false)
  const [offline, setOffline] = useState(!navigator.onLine)

  const username = localStorage.getItem('username') || 'Student'
  const grade    = localStorage.getItem('grade')    || ''

  useEffect(() => {
    const on  = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('grade')
    navigate('/login')
  }

  const changeLang = lng => {
    i18n.changeLanguage(lng)
    localStorage.setItem('lang', lng)
  }

  return (
    <div className="app-shell" lang={i18n.language}>
      {/* Overlay */}
      <div className={`sidebar-overlay${open ? ' show' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />

      {/* Sidebar */}
      <aside className={`sidebar${open ? '' : ' closed'}`} aria-label="Main navigation">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><Ico d={I.book} size={22} /></div>
          <div>
            <div className="sidebar-logo-text">AI Tutor</div>
            <div className="sidebar-logo-sub">Personalised Learning</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          {NAV.map(item => (
            <button key={item.path}
              className={`nav-link${location.pathname === item.path ? ' active' : ''}`}
              onClick={() => { navigate(item.path); setOpen(false) }}
              aria-current={location.pathname === item.path ? 'page' : undefined}>
              <span className="nav-link-icon"><Ico d={I[item.icon]} size={18} /></span>
              {item.label}
              {item.badge && <span className="nav-link-badge">{item.badge}</span>}
            </button>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: 'var(--sp-2)' }}>Language</div>
          {[['en','English'],['hi','हिंदी'],['gu','ગુજરાતી']].map(([lng, label]) => (
            <button key={lng}
              className={`nav-link${i18n.language === lng ? ' active' : ''}`}
              onClick={() => changeLang(lng)}
              aria-pressed={i18n.language === lng}>
              <span className="nav-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </span>
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{username.charAt(0).toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">{username}</div>
              {grade && <div className="sidebar-user-grade">Grade {grade}</div>}
            </div>
          </div>
          <button className="nav-link" onClick={logout}
            style={{ color: 'rgba(255,100,80,0.85)', marginTop: 4 }}
            aria-label="Logout">
            <span className="nav-link-icon"><Ico d={I.logout} size={18} /></span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <button className="topbar-menu-btn" onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}>
            <Ico d={I.menu} size={22} />
          </button>
          <h1 className="topbar-title">{title}</h1>
          <div className="topbar-actions">
            <button className="topbar-btn" aria-label="Notifications">
              <Ico d={I.bell} size={20} />
              <span className="topbar-notif-dot" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Page */}
        <div className="page-content">
          {offline && (
            <div className="offline-banner" role="status" aria-live="polite">
              <Ico d={I.wifi} size={16} />
              Saved offline — will sync when connected
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
