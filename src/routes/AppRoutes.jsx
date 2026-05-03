import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import VerifyEmailPage from '../pages/VerifyEmailPage'
import ProtectedRoute from './ProtectedRoute'
import Spinner from '../components/ui/Spinner'

export default function AppRoutes() {
  const { fetchMe, loading } = useAuthStore()

  useEffect(() => { fetchMe() }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-950 dark:bg-surface-950">
        <Spinner size={36} />
      </div>
    )
  }

  return (
        <Routes>
      {/* 👉 Default route = login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* 👉 Dashboard moved to /dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* 👉 fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
