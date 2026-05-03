import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, AlertCircle, MailCheck } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import AuthLayout from '../components/auth/AuthLayout'
import FormField from '../components/auth/FormField'

export default function RegisterPage() {
  const { register, loading } = useAuthStore()

  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)


  const passwordChecks = {
    length: form.password.length >= 6,
    lower: /[a-z]/.test(form.password),
    upper: /[A-Z]/.test(form.password),
    number: /\d/.test(form.password),
  }

const validate = () => {
  const e = {}

  if (!form.username.trim()) {
    e.username = 'Username is required'
  } else if (form.username.length < 3) {
    e.username = 'At least 3 characters'
  }

  if (!form.email) {
    e.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    e.email = 'Enter a valid email'
  }

  if (!form.password) {
    e.password = 'Password is required'
  } else if (form.password.length < 6) {
    e.password = 'At least 6 characters'
  } else if (!/(?=.*[a-z])/.test(form.password)) {
    e.password = 'Must include a lowercase letter'
  } else if (!/(?=.*[A-Z])/.test(form.password)) {
    e.password = 'Must include an uppercase letter'
  } else if (!/(?=.*\d)/.test(form.password)) {
    e.password = 'Must include a number'
  }

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
    const result = await register(form)
    if (result.success) {
      alert('Registration successful! Please check your email to verify your account.')
      setSuccess(true)
    }
    else setApiError(result.error)
  }

  if (success) {
    return (
      <AuthLayout title="Check your email" subtitle="We sent you a verification link">
        <div className="text-center space-y-5 py-4">
          <div className="w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mx-auto">
            <MailCheck size={28} className="text-accent-400" />
          </div>
          <div>
            <p className="text-sm dark:text-white/60 text-gray-500 leading-relaxed">
              We sent a verification email to{' '}
              <span className="font-medium dark:text-white text-gray-900">{form.email}</span>.
              Please check your inbox and click the link to activate your account.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-medium text-sm transition-all active:scale-95 shadow-lg shadow-accent-500/20"
          >
            Go to Login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create account" subtitle="Start chatting with AI in seconds">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Username"
          type="text"
          placeholder="johndoe"
          value={form.username}
          onChange={handleChange('username')}
          error={errors.username}
          autoComplete="username"
        />
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
          autoComplete="new-password"
          helperText="Must be 6+ chars, include uppercase, lowercase, and number"
        />

          <ul className="text-xs space-y-1 mt-2">
          <li className={passwordChecks.length ? "text-green-500" : "text-gray-400"}>
            • At least 6 characters
          </li>
          <li className={passwordChecks.upper ? "text-green-500" : "text-gray-400"}>
            • One uppercase letter
          </li>
          <li className={passwordChecks.lower ? "text-green-500" : "text-gray-400"}>
            • One lowercase letter
          </li>
          <li className={passwordChecks.number ? "text-green-500" : "text-gray-400"}>
            • One number
          </li>
        </ul>



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
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm dark:text-white/40 text-gray-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-accent-400 hover:text-accent-300 font-medium transition-colors underline-offset-2 hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  )
}
