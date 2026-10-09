import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { submitAnswer } from '../api'
import { queueAnswer } from '../hooks/useOfflineSync'

export default function QuizCard({ question, topic, subject, onNext }) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const handleSelect = async (option) => {
    if (selected) return
    setSelected(option)

    const payload = {
      topic,
      subject,
      question: question.question,
      student_answer: option,
      correct_answer: question.correct_answer,
      difficulty: question.difficulty,
    }

    try {
      const { data } = await submitAnswer(payload)
      setFeedback(data)
    } catch {
      // Offline: queue for later sync
      await queueAnswer(payload)
      const isCorrect = option === question.correct_answer
      setFeedback({ is_correct: isCorrect, feedback: isCorrect ? t('correct') : t('incorrect') })
    }
  }

  const optionLabels = ['A', 'B', 'C', 'D']

  return (
    <div style={{ padding: 16, border: '1px solid #e0e0e0', borderRadius: 12, margin: 12 }}>
      <p style={{ fontWeight: 600, fontSize: 17, marginBottom: 16 }}>{question.question}</p>

      {question.options.map((opt, i) => {
        const label = optionLabels[i]
        let bg = '#f8f9fa'
        if (selected) {
          if (label === question.correct_answer) bg = '#e6f4ea'
          else if (label === selected) bg = '#fce8e6'
        }
        return (
          <button key={label} onClick={() => handleSelect(label)} style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '10px 14px', margin: '6px 0', borderRadius: 8,
            border: '1px solid #ccc', background: bg, cursor: selected ? 'default' : 'pointer',
            fontSize: 15,
          }}>
            <strong>{label}.</strong> {opt}
          </button>
        )
      })}

      {feedback && (
        <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: feedback.is_correct ? '#e6f4ea' : '#fce8e6' }}>
          <p>{feedback.is_correct ? t('correct') : t('incorrect')}</p>
          <p style={{ fontSize: 13, color: '#555' }}>{question.explanation}</p>
          {feedback.mastered && <p style={{ color: '#1a73e8', fontWeight: 600 }}>🏆 {t('mastered')}</p>}
          <button onClick={onNext} style={{ marginTop: 8, padding: '8px 16px', borderRadius: 8, background: '#1a73e8', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
