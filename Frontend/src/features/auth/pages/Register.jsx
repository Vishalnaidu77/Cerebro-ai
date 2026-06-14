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
import SuccessMessage from '../components/SuccessMessage'
import VerificationPage from './VerificationPage'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localValidationError, setLocalValidationError] = useState('')
  const [registerSuccessfully, setRegisterSuccessfully] = useState(false)

  const { handleRegister } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, loading, error, initialized } = useSelector((state) => state.auth)
  console.log(user);
  
  // Clear errors on component mount
  useEffect(() => {
    dispatch(setError(null))
    setLocalValidationError('')
  }, [dispatch])

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (initialized && user && user.verified) {
      navigate('/')
    }
  }, [user, initialized, navigate])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f3ff, #fafafa)' }}>
        <svg className="animate-spin h-8 w-8" style={{ color: '#8b5cf6' }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalValidationError('')

    if (!username || !email || !password) {
      setLocalValidationError('Please fill in all fields.')
      return
    }

    if (password.length < 8) {
      setLocalValidationError('Password must be at least 8 characters long.')
      return
    }

    try {
      await handleRegister(username, email, password)
      setRegisterSuccessfully(true)
      navigate("/verification")
    } catch (err) {
      // Errors are handled in Redux by useAuth
    }
  }

  // if(!user?.user?.verified){
  //   return (
  //     <VerificationPage 
  //       loading={loading}
  //       error={error}
  //       successMessage={user?.message}
  //     />
  //   )
  // }

  return (
    <AuthCard>
      <AuthHeader title="Create Account" subtitle="Get started with Cerebro AI" />

      <AuthError message={localValidationError || error} />
      {registerSuccessfully && (
        <SuccessMessage message={user?.message} />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="username"
          label="Username"
          type="text"
          required
          disabled={loading}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="johndoe"
          icon="user"
        />

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
          Create Account
        </AuthButton>
      </form>

      <div className="mt-8 text-center text-sm" style={{ color: '#64648c' }}>
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium transition-colors underline underline-offset-4"
          style={{ color: '#8b5cf6', textDecorationColor: 'rgba(139, 92, 246, 0.3)' }}
        >
          Sign in
        </Link>
      </div>
    </AuthCard>
  )
}

export default Register
