import React from 'react'

const SuccessMessage = ({ message }) => {
  if (!message) return null

  return (
    <div className="mb-6 p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg flex items-start gap-2.5 animate-fadeIn">
      <svg className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  )
}

export default SuccessMessage