import React from 'react'

const AuthCard = ({ children }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #fafafa 40%, #ede9fe 100%)', fontFamily: "'Inter', sans-serif" }}>
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(139, 92, 246, 0.12)' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(168, 85, 247, 0.08)' }}></div>

      {/* Main Container Card */}
      <div className="w-full max-w-md rounded-2xl shadow-xl p-8 relative overflow-hidden transition-all duration-300" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139, 92, 246, 0.12)' }}>
        {/* Subtle accent border on top */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(to right, transparent, rgba(139, 92, 246, 0.6), transparent)' }}></div>
        {children}
      </div>
    </div>
  )
}

export default AuthCard
