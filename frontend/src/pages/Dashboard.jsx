import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ProgressRing from '../components/ProgressRing'
import StreakChart from '../components/StreakChart'
import Scratchpad from '../components/Scratchpad'
import Icon from '../components/Icon'
import '../styles/tokens.css'
import '../styles/dashboard.css'

const STORAGE_KEY = 'ai-tutor-tasks'
const POINTS_KEY  = 'ai-tutor-points'

const SEED_TASKS = [
  { id: 1, subject: 'Mathematics',    title: 'Fractions — Part 2',     type: 'Lesson',   duration: 20, due: '10:00 AM', status: 'progress' },
  { id: 2, subject: 'Science',        title: 'Photosynthesis Quiz',     type: 'Quiz',     duration: 15, due: '11:30 AM', status: 'todo'     },
  { id: 3, subject: 'Social Studies', title: 'Indian History Practice', type: 'Practice', duration: 10, due: '2:00 PM',  status: 'done'     },
]

const SEED_STREAK = [true, true, true, false, true, false, false]

const greetKey = () => {
  const h = new Date().getHours()
  if (h < 12) return 'good_morning'
  if (h < 17) return 'good_afternoon'
  return 'good_evening'
}

const typeBadge   = t => ({ Lesson:'badge-type-lesson', Quiz:'badge-type-quiz', Practice:'badge-type-practice' }[t] || 'badge-type-lesson')
const statusBadge = s => ({ todo:'badge-status-todo', progress:'badge-status-progress', done:'badge-status-done' }[s] || 'badge-status-todo')
const typeIcon    = t => ({ Lesson:'book', Quiz:'pencil', Practice:'bulb' }[t] || 'book')

function TaskCard({ task, onToggle, onStart, t }) {
  return (
    <li className={`task-card${task.status === 'done' ? ' done' : ''}`}
      aria-label={`${task.subject}: ${task.title}`}>
      <button className="neu-toggle" role="checkbox"
        aria-checked={task.status === 'done'}
        aria-label={task.status === 'done' ? 'Mark as not done' : `Mark ${task.title} as done`}
        onClick={() => onToggle(task.id)}>
        {task.status === 'done' && <Icon name="check" size={14} />}
      </button>
      <div className="task-info">
        <p className="task-subject">{task.subject}</p>
        <p className="task-title">{task.title}</p>
        <div className="task-meta">
          <span className={`badge ${typeBadge(task.type)}`}>
            <Icon name={typeIcon(task.type)} size={10} />
            {t(`type_${task.type.toLowerCase()}`)}
          </span>
          <span className={`badge ${statusBadge(task.status)}`}>{t(`status_${task.status}`)}</span>
          <span className="task-time">
            <Icon name="clock" size={10} style={{ verticalAlign:'middle', marginRight:2 }} />
            {task.duration} {t('min')} · {t('due')} {task.due}
          </span>
        </div>
      </div>
      <div className="task-action">
        <button className="btn-start" disabled={task.status === 'done'}
          onClick={() => onStart(task)}
          aria-label={`${task.status === 'progress' ? t('resume') : t('start')} ${task.title}`}>
          {task.status === 'progress' ? t('resume') : t('start')}
        </button>
      </div>
    </li>
  )
}

function AddTaskForm({ onAdd, t }) {
  const [open, setOpen]       = useState(false)
  const [title, setTitle]     = useState('')
  const [subject, setSubject] = useState('Mathematics')
  const [type, setType]       = useState('Lesson')
  const [due, setDue]         = useState('')

  const submit = e => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ id: Date.now(), subject, title: title.trim(), type, duration: 15, due: due || '—', status: 'todo' })
    setTitle(''); setDue(''); setOpen(false)
  }

  return (
    <div className="add-task-wrap">
      <button className="add-task-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <Icon name="plus" size={18} /> {t('add_task')}
      </button>
      {open && (
        <form className="add-task-form" onSubmit={submit} noValidate>
          <div className="form-row">
            <label htmlFor="atf-title">{t('task_title')}</label>
            <input id="atf-title" className="neu-input" type="text"
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Fractions — Part 2" required autoComplete="off" />
          </div>
          <div className="form-row-2">
            <div className="form-row">
              <label htmlFor="atf-sub">{t('task_subject')}</label>
              <select id="atf-sub" className="neu-input" value={subject} onChange={e => setSubject(e.target.value)}>
                {['Mathematics','Science','Social Studies','English'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="atf-type">{t('task_type')}</label>
              <select id="atf-type" className="neu-input" value={type} onChange={e => setType(e.target.value)}>
                {['Lesson','Quiz','Practice'].map(tp => <option key={tp}>{tp}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="atf-due">{t('task_due')}</label>
            <input id="atf-due" className="neu-input" type="time" value={due} onChange={e => setDue(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">{t('add_task')}</button>
        </form>
      )}
    </div>
  )
}

function useToast() {
  const [toasts, setToasts] = useState([])
  const add = useCallback(msg => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000)
  }, [])
  return { toasts, add }
}

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toasts, add: addToast } = useToast()

  const [tasks,    setTasks]    = useState(null)
  const [filter,   setFilter]   = useState('all')
  const [points,   setPoints]   = useState(() => Number(localStorage.getItem(POINTS_KEY) || 0))
  const [streak]                = useState(SEED_STREAK)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        setTasks(saved ? JSON.parse(saved) : SEED_TASKS)
      } catch { setTasks(SEED_TASKS) }
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => { if (tasks !== null) localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { localStorage.setItem(POINTS_KEY, String(points)) }, [points])

  const doneTasks  = tasks ? tasks.filter(t => t.status === 'done') : []
  const totalTasks = tasks ? tasks.length : 0
  const donePct    = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0
  const streakCount = streak.filter(Boolean).length

  const filtered = tasks
    ? tasks.filter(t => filter === 'all' ? true : filter === 'done' ? t.status === 'done' : t.status !== 'done')
    : []

  const toggleTask = id => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task
      const next = task.status === 'done' ? 'todo' : 'done'
      if (next === 'done') { addToast(t('toast_done')); setPoints(p => p + 10) }
      return { ...task, status: next }
    }))
  }

  const addTask  = task => { setTasks(p => [...p, task]); addToast('Task added!') }
  const startTask = task => task.type === 'Quiz' ? navigate('/quiz') : navigate('/home')

  const username = localStorage.getItem('username') || '[Name]'

  return (
    <Layout title="Dashboard">
      {/* Greeting */}
      <div className="dash-greeting">
        <p className="greeting-sub">{t(greetKey())}</p>
        <h2 className="greeting-name">{username}</h2>
        <p className="greeting-tasks">
          {tasks === null ? '…' : t('tasks_today', { count: tasks.length })}
        </p>
      </div>

      <div className="dash-grid">
        {/* Tasks */}
        <section className="dash-col-main" aria-labelledby="tasks-heading">
          <div className="section-header">
            <h3 className="section-title" id="tasks-heading">{t('todays_tasks')}</h3>
            <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
              {[['all','filter_all'],['todo','filter_todo'],['done','filter_done']].map(([f, key]) => (
                <button key={f} role="tab"
                  className={`filter-tab${filter === f ? ' active' : ''}`}
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}>
                  {t(key)}
                </button>
              ))}
            </div>
          </div>

          {tasks === null && (
            <div className="task-list" aria-busy="true">
              {[1,2,3].map(i => <div key={i} className="skeleton skeleton-card" />)}
            </div>
          )}

          {tasks !== null && filtered.length === 0 && (
            <div className="empty-state">
              <Icon name="book" size={48} />
              <p className="empty-title">{t('no_tasks_title')}</p>
              <p>{t('no_tasks_body')}</p>
            </div>
          )}

          {tasks !== null && filtered.length > 0 && (
            <ul className="task-list" role="list">
              {filtered.map(task => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} onStart={startTask} t={t} />
              ))}
            </ul>
          )}

          <AddTaskForm onAdd={addTask} t={t} />
        </section>

        {/* Sidebar widgets */}
        <aside className="dash-col-side">
          <ProgressRing pct={donePct} done={doneTasks.length} total={totalTasks} />

          <div className="neu-card points-card">
            <div className="points-icon" aria-hidden="true">
              <Icon name="trophy" size={24} />
            </div>
            <div>
              <p className="points-val">{points}</p>
              <p className="points-sub">{t('points')}</p>
            </div>
          </div>
        </aside>

        {/* Gap card */}
        <div className="dash-col-full">
          <div className="neu-card gap-card" role="region" aria-label={t('needs_practice')}>
            <div className="gap-label-row">
              <Icon name="alert" size={16} style={{ color:'var(--color-alert)', flexShrink:0 }} />
              <span className="gap-label">{t('needs_practice')}</span>
            </div>
            <p className="gap-topic">[Topic]</p>
            <button className="btn-practice" onClick={() => navigate('/quiz')}>
              {t('practice_now')}
            </button>
          </div>
        </div>

        {/* Streak */}
        <div className="dash-col-streak">
          <StreakChart streakDays={streak} streakCount={streakCount} />
        </div>

        {/* Scratchpad */}
        <div className="dash-col-scratch">
          <Scratchpad />
        </div>
      </div>

      {/* Toasts */}
      <div className="toast-wrap" aria-live="polite" aria-atomic="true">
        {toasts.map(toast => <div key={toast.id} className="toast" role="status">{toast.msg}</div>)}
      </div>
    </Layout>
  )
}
