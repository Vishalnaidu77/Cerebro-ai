import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({ children }) => {

    const { user, loading, initialized } = useSelector(state => state.auth)

    if (!initialized || loading) {
        return (
          <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

  return children
}

export default Protected