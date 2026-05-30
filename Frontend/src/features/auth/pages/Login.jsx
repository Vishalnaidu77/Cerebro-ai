import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import useAuth from '../hooks/useAuth'
import { setError } from '../auth.slice'
import AuthCard from '../components/AuthCard'
import AuthHeader from '../components/AuthHeader'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'
import AuthError from '../components/AuthError'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      // Errors are handled in Redux by useAuth
    }
  }

  return (
    <AuthCard>
      <AuthHeader title="Welcome Back" subtitle="Sign in to your Cerebro account" />

      <AuthError message={localValidationError || error} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          required
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          icon="email"
        />

        <AuthInput
          id="password"
          label="Password"
          type="password"
          required
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon="password"
        />

        <AuthButton loading={loading} disabled={loading}>
          Sign In
        </AuthButton>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-500">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-amber-500 hover:text-amber-400 transition-colors underline underline-offset-4 decoration-amber-500/30 hover:decoration-amber-500/80"
        >
          Sign up now
        </Link>
      </div>
    </AuthCard>
  )
}

export default Login