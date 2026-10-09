import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { askTutor } from '../api'

export default function ChatWindow({ topic = 'general', subject = 'general' }) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const mediaRef = useRef(null)

  const send = async (text, audioBlob = null) => {
    if (!text && !audioBlob) return
    setLoading(true)

    const userMsg = { role: 'user', text: text || '🎤 Voice question' }
    setMessages((m) => [...m, userMsg])

    const form = new FormData()
    if (text) form.append('question', text)
    form.append('topic', topic)
    form.append('subject', subject)
    if (audioBlob) form.append('audio', audioBlob, 'question.webm')

    try {
      const { data } = await askTutor(form)
      setMessages((m) => [...m, { role: 'tutor', text: data.answer }])
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        (err?.code === 'ECONNABORTED' ? 'Request timed out. The AI is taking too long — please try again.' : null) ||
        (err?.message?.includes('Network') ? 'Cannot reach the server. Make sure the backend is running.' : null) ||
        `Error ${err?.response?.status ?? ''}: ${err?.response?.statusText ?? 'Unknown error'}`
      setMessages((m) => [...m, { role: 'tutor', text: msg }])
    } finally {
      setLoading(false)
      setInput('')
    }
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    const chunks = []
    recorder.ondataavailable = (e) => chunks.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      send(null, blob)
      stream.getTracks().forEach((t) => t.stop())
    }
    mediaRef.current = recorder
    recorder.start()
    setRecording(true)
  }

  const stopRecording = () => {
    mediaRef.current?.stop()
    setRecording(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 12 }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.role === 'user' ? 'right' : 'left',
            margin: '6px 0',
          }}>
            <span style={{
              display: 'inline-block', padding: '8px 12px', borderRadius: 12,
              background: m.role === 'user' ? '#1a73e8' : '#f1f3f4',
              color: m.role === 'user' ? '#fff' : '#000',
              maxWidth: '80%',
            }}>
              {m.text}
            </span>
          </div>
        ))}
        {loading && <div style={{ color: '#888', fontStyle: 'italic' }}>{t('loading')}</div>}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder={t('ask_question')}
        />
        <button onClick={() => send(input)} style={btnStyle('#1a73e8')}>{t('submit')}</button>
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          style={btnStyle(recording ? '#e53935' : '#34a853')}
        >
          🎤
        </button>
      </div>
    </div>
  )
}

const btnStyle = (bg) => ({
  padding: '10px 16px', borderRadius: 8, border: 'none',
  background: bg, color: '#fff', cursor: 'pointer', fontSize: 16,
})
