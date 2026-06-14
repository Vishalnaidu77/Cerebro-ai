import React, { useState } from 'react'

const icons = {
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  password: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

const AuthInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  icon
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField && showPassword ? 'text' : type

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64648c' }}>
        {label}
      </label>
      <div className="relative">
        {icon && icons[icon] && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: '#9e9eb8' }}>
            {icons[icon]}
          </span>
        )}
        <input
          id={id}
          type={inputType}
          required={required}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl py-2.5 ${
            icon ? 'pl-10' : 'pl-4'
          } ${isPasswordField ? 'pr-10' : 'pr-4'} transition-all duration-200 text-sm`}
          style={{
            background: 'rgba(248, 247, 252, 0.8)',
            border: '1.5px solid #e8e5f0',
            color: '#1a1a2e',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'
            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e8e5f0'
            e.target.style.boxShadow = 'none'
          }}
        />
        {isPasswordField && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
            style={{ color: '#9e9eb8' }}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default AuthInput
