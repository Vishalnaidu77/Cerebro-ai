import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import useAuth from '../hooks/useAuth'
import { setError } from '../auth.slice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localValidationError, setLocalValidationError] = useState('')

  const { handleLogin } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, loading, error } = useSelector((state) => state.auth)

  // Clear errors when navigating away or loading the page
  useEffect(() => {
    dispatch(setError(null))
    setLocalValidationError('')
  }, [dispatch])

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalValidationError('')

    if (!email || !password) {
      setLocalValidationError('Please fill in all fields.')
      return
    }

    try {
      await handleLogin(email, password)
    } catch (err) {
      // Errors are handled in Redux by useAuth, but we catch locally just in case
    }
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-300 hover:border-zinc-700/50">
        {/* Subtle accent border on top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/70 to-transparent"></div>

        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          {/* Hexagonal/Minimalist Brain Logo */}
          <div className="w-12 h-12 bg-zinc-950 border border-amber-500/40 rounded-xl flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6m-6 4h6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-amber-500/80 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Sign in to your Cerebro account</p>
        </div>

        {/* Error Display */}
        {(error || localValidationError) && (
          <div className="mb-6 p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-start gap-2.5 animate-fadeIn">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{localValidationError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              {/* Optional: Add Forgot Password link if needed in the future */}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-10 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200"
              />
              <button
                type="button"
                disabled={loading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-zinc-950 font-semibold py-2.5 rounded-xl transition-all duration-300 hover:from-amber-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.15)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-zinc-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-amber-500 hover:text-amber-400 transition-colors underline underline-offset-4 decoration-amber-500/30 hover:decoration-amber-500/80"
          >
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login