import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getQuiz } from '../api'
import QuizCard from '../components/QuizCard'
import Layout from '../components/Layout'
import '../styles/tokens.css'

const TOPICS = ['Fractions', 'Algebra', 'Photosynthesis', 'Motion', 'Indian History', 'Ecosystems', 'Civics']

export default function QuizPage() {
  const { t } = useTranslation()
  const [topic,     setTopic]     = useState('Fractions')
  const [questions, setQuestions] = useState([])
  const [index,     setIndex]     = useState(0)
  const [done,      setDone]      = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const startQuiz = async () => {
    setLoading(true); setDone(false); setIndex(0); setError('')
    try {
      const { data } = await getQuiz(topic)
      setQuestions(data.questions)
    } catch {
      setError('Could not load quiz. Check your connection and make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (index + 1 >= questions.length) setDone(true)
    else setIndex(index + 1)
  }

  const reset = () => { setQuestions([]); setDone(false); setIndex(0) }

  return (
    <Layout title={t('quiz') || 'Quiz'}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Topic selector */}
        {questions.length === 0 && !done && (
          <div style={{
            background:'var(--color-surface)', borderRadius:'var(--r-lg)',
            boxShadow:'var(--neu-raised)', padding:'var(--sp-3)',
            display:'flex', flexDirection:'column', gap:'var(--sp-3)',
          }}>
            <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'var(--fs-h2)', color:'var(--color-ink)' }}>
              Choose a topic
            </h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {TOPICS.map(tp => (
                <button key={tp}
                  onClick={() => setTopic(tp)}
                  style={{
                    padding:'8px 18px', borderRadius:'999px', cursor:'pointer',
                    fontFamily:'var(--ff-body)', fontSize:'var(--fs-small)', fontWeight:700,
                    border: topic === tp ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                    background: topic === tp ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: topic === tp ? '#fff' : 'var(--color-ink-muted)',
                    boxShadow: 'var(--neu-raised-sm)', minHeight:44,
                    transition:'background 0.15s, color 0.15s',
                  }}
                  aria-pressed={topic === tp}>
                  {tp}
                </button>
              ))}
            </div>

            {error && (
              <p style={{ color:'var(--color-alert)', fontSize:'var(--fs-small)', fontWeight:600 }}>{error}</p>
            )}

            <button
              onClick={startQuiz} disabled={loading}
              style={{
                minHeight:52, padding:'12px 32px', borderRadius:'var(--r-sm)', border:'none',
                background:'var(--color-primary)', color:'#fff',
                fontFamily:'var(--ff-body)', fontSize:'var(--fs-body)', fontWeight:700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow:'var(--neu-raised-sm)', alignSelf:'flex-start',
                opacity: loading ? 0.6 : 1, transition:'opacity 0.15s',
              }}>
              {loading ? t('loading') : 'Start Quiz →'}
            </button>
          </div>
        )}

        {/* Quiz in progress */}
        {questions.length > 0 && !done && (
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--sp-2)' }}>
            <div style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'var(--sp-1) 0',
            }}>
              <span style={{ fontSize:'var(--fs-small)', color:'var(--color-ink-muted)', fontWeight:600 }}>
                Question {index + 1} of {questions.length} — {topic}
              </span>
              <div style={{
                height:6, flex:1, maxWidth:200, marginLeft:'var(--sp-2)',
                background:'var(--color-border)', borderRadius:'999px', overflow:'hidden',
              }}>
                <div style={{
                  height:'100%', borderRadius:'999px',
                  background:'var(--color-primary)',
                  width:`${((index + 1) / questions.length) * 100}%`,
                  transition:'width 0.3s',
                }} />
              </div>
            </div>
            <QuizCard question={questions[index]} topic={topic} subject="general" onNext={handleNext} />
          </div>
        )}

        {/* Done */}
        {done && (
          <div style={{
            background:'var(--color-surface)', borderRadius:'var(--r-lg)',
            boxShadow:'var(--neu-raised)', padding:'var(--sp-6)',
            textAlign:'center', display:'flex', flexDirection:'column',
            alignItems:'center', gap:'var(--sp-2)',
          }}>
            <div style={{
              width:72, height:72, borderRadius:'50%',
              background:'var(--color-primary)', color:'var(--color-accent)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:32,
            }}>✓</div>
            <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'var(--fs-h1)', color:'var(--color-primary)' }}>
              Quiz Complete!
            </h2>
            <p style={{ color:'var(--color-ink-muted)', fontSize:'var(--fs-body)' }}>
              Great work on {topic}. Keep practising to master it!
            </p>
            <button onClick={reset} style={{
              minHeight:48, padding:'10px 28px', borderRadius:'var(--r-sm)', border:'none',
              background:'var(--color-primary)', color:'#fff',
              fontFamily:'var(--ff-body)', fontSize:'var(--fs-body)', fontWeight:700,
              cursor:'pointer', boxShadow:'var(--neu-raised-sm)',
            }}>
              Try Another Topic
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
