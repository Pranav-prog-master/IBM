import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useStreakChart } from '../hooks/canvas/useStreakChart'
import Icon from './Icon'

const TODAY_IDX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

export default function StreakChart({ streakDays, streakCount }) {
  const { t } = useTranslation()
  const canvasRef = useRef(null)
  useStreakChart(canvasRef, streakDays, TODAY_IDX)

  const altText = streakDays
    .map((d, i) => `${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}: ${d ? 'done' : 'missed'}`)
    .join(', ')

  return (
    <div className="neu-card streak-card">
      <div className="streak-header">
        <h2 className="section-title">{t('weekly_streak')}</h2>
        <span className="streak-count" aria-label={`${streakCount}-day streak`}>
          <Icon name="flame" size={18} />
          {streakCount} {t('days')}
        </span>
      </div>
      <div className="streak-canvas-wrap">
        <canvas ref={canvasRef} aria-label={`Weekly streak: ${altText}`} />
      </div>
      <p className="sr-only">{altText}</p>
    </div>
  )
}
