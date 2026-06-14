import React, { useState } from 'react'
import AuthCard from '../components/AuthCard'
import AuthButton from '../components/AuthButton'
import { Link, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import useAuth from '../hooks/useAuth'

const VerificationPage = () => {

    const { user, loading, error } = useSelector(state => state.auth)
    const { handleResendEmail } = useAuth()

    const location = useLocation()
    const email = user?.email || location.state?.email

    const [ resendSuccessMsg, setResendSuccessMsg ] = useState(null)

    const onResend = async (e) => {
        e.preventDefault()
        const res = await handleResendEmail(email)
        setResendSuccessMsg(res.message)
    }

  return (
    <AuthCard>
      <div className="flex flex-col items-center">
        {/* Envelope Icon with Pulse Glow */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.08)' }}>
          <span className="absolute inline-flex h-full w-full rounded-2xl animate-ping" style={{ background: 'rgba(139, 92, 246, 0.05)' }}></span>
          <svg className="w-8 h-8 relative z-10" style={{ color: '#8b5cf6' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-center mb-3" style={{ background: 'linear-gradient(135deg, #1a1a2e, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Verify Your Email
        </h2>
        
        <p className="text-sm text-center leading-relaxed mb-6" style={{ color: '#64648c' }}>
          We have sent a verification link to your email address. Please check your inbox and verify your email to access Cerebro.
        </p>

        {error && (
          <div className="w-full mb-6 p-3 text-sm rounded-lg flex items-start gap-2.5" style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#dc2626' }}>
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-left">{error}</span>
          </div>
        )}

        {resendSuccessMsg && (
          <div className="w-full mb-6 p-3 text-sm rounded-lg flex items-start gap-2.5" style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)', color: '#059669' }}>
            <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#059669' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-left">{resendSuccessMsg}</span>
          </div>
        )}

        <div className="w-full space-y-4">
          <AuthButton onClick={onResend} loading={loading}>
            Resend Verification Email
          </AuthButton>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: '#64648c' }}
              onMouseEnter={(e) => e.target.style.color = '#8b5cf6'}
              onMouseLeave={(e) => e.target.style.color = '#64648c'}
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </AuthCard>
  )
}

export default VerificationPage