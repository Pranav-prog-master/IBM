import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './i18n/index.js'
import LandingPage  from './pages/Landing'
import LoginPage    from './pages/Login'
import Dashboard    from './pages/Dashboard'
import HomePage     from './pages/Home'
import QuizPage     from './pages/Quiz'
import ProgressPage from './pages/Progress'
import SettingsPage from './pages/Settings'

const PrivateRoute = ({ children }) =>
  localStorage.getItem('token') ? children : <Navigate to="/login" replace />

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/home"      element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/quiz"      element={<PrivateRoute><QuizPage /></PrivateRoute>} />
        <Route path="/progress"  element={<PrivateRoute><ProgressPage /></PrivateRoute>} />
        <Route path="/settings"  element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
