import React from 'react'

const SuccessMessage = ({ message }) => {
  if (!message) return null

  return (
    <div className="mb-6 p-3 text-sm rounded-lg flex items-start gap-2.5" style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)', color: '#059669' }}>
      <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#059669' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  )
}

export default SuccessMessage