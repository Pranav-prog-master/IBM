export default function MasteryBar({ topic, score, mastered }) {
  const pct = Math.round(score * 100)
  const color = mastered ? '#34a853' : score >= 0.4 ? '#fbbc04' : '#ea4335'

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 14 }}>{topic}</span>
        <span style={{ fontSize: 13, color }}>{pct}% {mastered ? '✓' : ''}</span>
      </div>
      <div style={{ height: 8, background: '#e0e0e0', borderRadius: 4 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.4s' }} />
      </div>
    </div>
  )
}
