import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressRing } from '../hooks/canvas/useProgressRing'

export default function ProgressRing({ pct, done, total }) {
  const { t } = useTranslation()
  const canvasRef = useRef(null)
  useProgressRing(canvasRef, pct)

  return (
    <div className="neu-card progress-card" role="region" aria-label={t('goals_progress')}>
      <h2 className="card-title">{t('goals_progress')}</h2>
      <div className="ring-wrap">
        <canvas ref={canvasRef}
          aria-label={`${pct}% of today's goals complete`} />
        <div className="ring-label" aria-hidden="true">
          <span className="ring-pct">{pct}%</span>
          <span className="ring-sub">{t('complete')}</span>
        </div>
      </div>
      <p className="progress-caption">
        {done} / {total} {t('tasks_done')}
      </p>
    </div>
  )
}
