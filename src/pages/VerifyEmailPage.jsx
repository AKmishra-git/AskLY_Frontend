import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { authApi } from '../services/api'
import AuthLayout from '../components/auth/AuthLayout'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) { setStatus('error'); setMessage('Verification token missing.'); return }

    authApi.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => { setStatus('error'); setMessage(err.message) })
  }, [])

  return (
    <AuthLayout title="Email Verification" subtitle="Verifying your account…">
      <div className="text-center py-6 space-y-4">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={32} className="animate-spin text-accent-400" />
            <p className="text-sm dark:text-white/50 text-gray-500">Verifying your email…</p>
          </div>
        )}
        {status === 'success' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={26} className="text-green-400" />
            </div>
            <div>
              <p className="font-semibold dark:text-white text-gray-900 mb-1">Email verified!</p>
              <p className="text-sm dark:text-white/50 text-gray-500">Your account is now active. You can log in.</p>
            </div>
            <Link to="/login" className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-medium text-sm transition-all active:scale-95">
              Go to Login
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <XCircle size={26} className="text-red-400" />
            </div>
            <div>
              <p className="font-semibold dark:text-white text-gray-900 mb-1">Verification failed</p>
              <p className="text-sm dark:text-white/50 text-gray-500">{message || 'The link may be invalid or expired.'}</p>
            </div>
            <Link to="/register" className="inline-flex items-center justify-center w-full py-3 rounded-xl border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 font-medium text-sm transition-all active:scale-95 hover:dark:bg-white/5 hover:bg-gray-50">
              Back to Register
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
