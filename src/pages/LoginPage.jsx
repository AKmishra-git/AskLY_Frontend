import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import AuthLayout from '../components/auth/AuthLayout'
import FormField from '../components/auth/FormField'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, user } = useAuthStore()

 const [justLoggedIn, setJustLoggedIn] = useState(false)

    useEffect(() => {
      if (user && justLoggedIn) {
        navigate('/dashboard', { replace: true })
      }
    }, [user, justLoggedIn])

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: '' }))
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const result = await login(form)
        if (result.success) {
          setJustLoggedIn(true)
          navigate('/dashboard', { replace: true })
      } else {
      const error = result.error.toLowerCase()

      if (error.includes('password') || error.includes('user')) {
        alert('Invalid credentials or user does not exist')
      } else if (error.includes('verify')) {
        alert('Please verify your email before logging in')
      } else {
        alert(result.error)
      }
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to Lumina">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="email"
        />
        <FormField
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
          autoComplete="current-password"
        />

        {apiError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in">
            <AlertCircle size={14} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{apiError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-medium text-sm transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-lg shadow-accent-500/20"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm dark:text-white/40 text-gray-500">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-accent-400 hover:text-accent-300 font-medium transition-colors underline-offset-2 hover:underline"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
