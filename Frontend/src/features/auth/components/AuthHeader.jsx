import React from 'react'

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Purple Orb Logo */}
      <div className="mb-3" style={{ width: 48, height: 48, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #c084fc, #8b5cf6 40%, #6d28d9 70%, #4c1d95 100%)', boxShadow: '0 4px 16px rgba(139, 92, 246, 0.35)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 9, left: 12, width: 12, height: 8, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.55), transparent)', filter: 'blur(1.5px)' }} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight" style={{ background: 'linear-gradient(135deg, #1a1a2e, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {title}
      </h2>
      {subtitle && <p className="text-sm mt-1" style={{ color: '#64648c' }}>{subtitle}</p>}
    </div>
  )
}

export default AuthHeader
