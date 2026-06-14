import React from 'react'

const AuthButton = ({
  children,
  type = 'submit',
  loading = false,
  disabled = false,
  onClick
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className="w-full font-semibold py-2.5 rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.boxShadow = '0 6px 28px rgba(139, 92, 246, 0.4)'
          e.target.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.25)'
        e.target.style.transform = 'translateY(0)'
      }}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        children
      )}
    </button>
  )
}

export default AuthButton
