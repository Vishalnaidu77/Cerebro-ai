import React from 'react'

const AuthCard = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-300 hover:border-zinc-700/50">
        {/* Subtle accent border on top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/70 to-transparent"></div>
        {children}
      </div>
    </div>
  )
}

export default AuthCard
