import React from 'react'

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Hexagonal/Minimalist Brain Logo */}
      <div className="w-12 h-12 bg-zinc-950 border border-amber-500/40 rounded-xl flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6m-6 4h6" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-amber-500/80 bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}

export default AuthHeader
