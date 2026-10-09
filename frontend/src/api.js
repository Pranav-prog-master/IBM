import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
})

/* Attach JWT to every request */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* ── Auth ── */

/**
 * Login via OAuth2 password flow.
 * FastAPI /auth/token expects application/x-www-form-urlencoded.
 */
export const login = (username, password) => {
  const body = new URLSearchParams({ username, password })
  return api
    .post('/auth/token', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    .then((r) => {
      localStorage.setItem('token', r.data.access_token)
      return r.data
    })
}

/**
 * Register a new student.
 * FastAPI /auth/register expects JSON (Pydantic RegisterRequest).
 */
export const register = (data) =>
  api
    .post('/auth/register', data, { headers: { 'Content-Type': 'application/json' } })
    .then((r) => {
      // If server returns a token (existing user with correct password), store it
      if (r.data.access_token) localStorage.setItem('token', r.data.access_token)
      return r.data
    })

/* ── Tutor ── */
export const askTutor = (formData) => api.post('/tutor/ask', formData)

/* ── Quiz ── */
export const getQuiz      = (topic, subject) => api.get('/quiz/generate', { params: { topic, subject } })
export const submitAnswer = (data)           => api.post('/quiz/submit', data)

/* ── Progress ── */
export const getMastery   = ()                              => api.get('/progress/mastery')
export const getHistory   = (topic, limit = 50)            => api.get('/progress/history', { params: { topic, limit } })

/* ── Translation ── */
export const translateText = (text, source_lang, target_lang) =>
  api.post('/translate', { text, source_lang, target_lang })

export default api
