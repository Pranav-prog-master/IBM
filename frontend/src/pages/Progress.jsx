import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { getMastery } from '../api'
import MasteryBar from '../components/MasteryBar'
import Layout from '../components/Layout'
import '../styles/tokens.css'

export default function ProgressPage() {
  const { t } = useTranslation()
  const [mastery,  setMastery]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getMastery()
      .then(({ data }) => setMastery(data.mastery))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const radarData = mastery.map(m => ({ topic: m.topic, score: Math.round(m.mastery_score * 100) }))

  return (
    <Layout title={t('progress') || 'My Progress'}>
      {loading && (
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--sp-2)' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:40 }} />)}
        </div>
      )}

      {!loading && mastery.length === 0 && (
        <div style={{
          textAlign:'center', padding:'var(--sp-6)',
          color:'var(--color-ink-muted)', fontFamily:'var(--ff-display)',
          fontSize:'var(--fs-h2)', fontWeight:700,
        }}>
          No progress yet.<br />
          <span style={{ fontSize:'var(--fs-body)', fontFamily:'var(--ff-body)', fontWeight:400 }}>
            Start a quiz to track your mastery!
          </span>
        </div>
      )}

      {!loading && mastery.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--sp-3)' }}>
          {radarData.length > 2 && (
            <div style={{
              background:'var(--color-surface)', borderRadius:'var(--r-lg)',
              boxShadow:'var(--neu-raised)', padding:'var(--sp-3)',
            }}>
              <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'var(--fs-h3)', marginBottom:'var(--sp-2)' }}>
                Mastery Overview
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="topic" tick={{ fontSize:11, fill:'var(--color-ink-muted)', fontFamily:'Nunito' }} />
                  <Radar dataKey="score" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.25} />
                  <Tooltip formatter={v => [`${v}%`, 'Mastery']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div style={{
            background:'var(--color-surface)', borderRadius:'var(--r-lg)',
            boxShadow:'var(--neu-raised)', padding:'var(--sp-3)',
          }}>
            <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'var(--fs-h3)', marginBottom:'var(--sp-2)' }}>
              Per-Topic Mastery
            </h3>
            {mastery.map(m => (
              <MasteryBar key={m.topic} topic={m.topic} score={m.mastery_score} mastered={m.mastered} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}
