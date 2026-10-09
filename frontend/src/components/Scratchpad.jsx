import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScratchpad } from '../hooks/canvas/useScratchpad'
import Icon from './Icon'

export default function Scratchpad() {
  const { t } = useTranslation()
  const canvasRef = useRef(null)
  const { undo, clear } = useScratchpad(canvasRef)

  return (
    <div className="neu-card scratchpad-card">
      <div className="scratchpad-header">
        <h2 className="card-title">{t('scratchpad')}</h2>
        <div className="scratchpad-controls">
          <button className="icon-btn" onClick={undo} aria-label={t('undo')}>
            <Icon name="undo" size={16} />
          </button>
          <button className="icon-btn" onClick={clear} aria-label={t('clear')}>
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="scratchpad-canvas"
        aria-label="Scratchpad — draw or write here"
      />
    </div>
  )
}
