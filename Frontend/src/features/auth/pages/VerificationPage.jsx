import React from 'react'
import AuthCard from '../components/AuthCard'
import AuthButton from '../components/AuthButton'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import useAuth from '../hooks/useAuth'

const VerificationPage = () => {

    const { user, loading, error } = useSelector(state => state.auth)
    const { handleResendEmail } = useAuth()

    const onResend = async (e) => {
        e.preventDefault()
        await handleResendEmail(user?.user?.email)
    }

    const successMessage = user?.message || ""

  return (
    <AuthCard>
      <div className="flex flex-col items-center">
        {/* Envelope Icon with Pulse Glow */}
        <div className="w-16 h-16 bg-zinc-950 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.1)] relative">
          <span className="absolute inline-flex h-full w-full rounded-2xl bg-amber-500/5 animate-ping"></span>
          <svg className="w-8 h-8 text-amber-500 relative z-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-center bg-gradient-to-r from-zinc-100 via-zinc-200 to-amber-500/80 bg-clip-text text-transparent mb-3">
          Verify Your Email
        </h2>
        
        <p className="text-zinc-400 text-sm text-center leading-relaxed mb-6">
          We have sent a verification link to your email address. Please check your inbox and verify your email to access Cerebro.
        </p>

        {error && (
          <div className="w-full mb-6 p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-start gap-2.5 animate-fadeIn">
            <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-left">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="w-full mb-6 p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg flex items-start gap-2.5 animate-fadeIn">
            <svg className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-left">{successMessage}</span>
          </div>
        )}

        <div className="w-full space-y-4">
          <AuthButton onClick={onResend} loading={loading}>
            Resend Verification Email
          </AuthButton>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="text-sm font-medium text-zinc-500 hover:text-amber-500 transition-colors duration-200"
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