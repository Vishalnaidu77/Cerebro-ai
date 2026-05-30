import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import AuthCard from './AuthCard'
import AuthHeader from './AuthHeader'
import AuthButton from './AuthButton'

const AccessCard = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  return (
    <AuthCard>
      <AuthHeader 
        title={`Welcome back, ${user?.username || 'User'}`} 
        subtitle="You are currently signed in." 
      />
      
      <div className="flex flex-col items-center mt-6">
        <p className="text-zinc-400 text-sm text-center mb-6">
          Access your Cerebro AI workspace to continue.
        </p>
        
        <AuthButton onClick={() => navigate("/")}>
          Access your account
        </AuthButton>
      </div>
    </AuthCard>
  )
}

export default AccessCard