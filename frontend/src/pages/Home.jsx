import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import ChatWindow from '../components/ChatWindow'
import '../styles/tokens.css'

const SUBJECTS = {
  Mathematics:    ['Fractions', 'Algebra', 'Geometry', 'Statistics'],
  Science:        ['Photosynthesis', 'Motion', 'Atoms', 'Ecosystems'],
  'Social Studies':['Indian History', 'Geography', 'Civics'],
  English:        ['Grammar', 'Comprehension', 'Writing'],
}

export default function HomePage() {
  const { t } = useTranslation()
  const [subject, setSubject] = useState('Mathematics')
  const [topic,   setTopic]   = useState('Fractions')

  return (
    <Layout title={t('ask_ai') || 'AI Tutor'}>
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--sp-2)', height:'calc(100dvh - var(--topbar-h) - var(--sp-6))' }}>

        {/* Subject chips */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {Object.keys(SUBJECTS).map(s => (
            <button key={s}
              onClick={() => { setSubject(s); setTopic(SUBJECTS[s][0]) }}
              style={{
                padding:'6px 16px', borderRadius:'999px', border:'none', cursor:'pointer',
                fontFamily:'var(--ff-body)', fontSize:'var(--fs-small)', fontWeight:700,
                background: subject === s ? 'var(--color-primary)' : 'var(--color-surface)',
                color:      subject === s ? '#fff' : 'var(--color-ink-muted)',
                boxShadow:  subject === s ? 'none' : 'var(--neu-raised-sm)',
                transition: 'background 0.15s',
                minHeight: 44,
              }}
              aria-pressed={subject === s}>
              {s}
            </button>
          ))}
        </div>

        {/* Topic chips */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {SUBJECTS[subject].map(tp => (
            <button key={tp}
              onClick={() => setTopic(tp)}
              style={{
                padding:'4px 12px', borderRadius:'999px', cursor:'pointer',
                fontFamily:'var(--ff-body)', fontSize:'var(--fs-xs)', fontWeight:700,
                border: topic === tp ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                background: topic === tp ? 'rgba(31,77,58,0.08)' : 'var(--color-surface)',
                color: topic === tp ? 'var(--color-primary)' : 'var(--color-ink-muted)',
                minHeight: 36,
              }}
              aria-pressed={topic === tp}>
              {tp}
            </button>
          ))}
        </div>

        {/* Chat */}
        <div style={{ flex:1, overflow:'hidden', borderRadius:'var(--r-lg)', boxShadow:'var(--neu-raised)' }}>
          <ChatWindow topic={topic} subject={subject} />
        </div>
      </div>
    </Layout>
  )
}
