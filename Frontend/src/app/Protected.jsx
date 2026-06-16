import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import Loader from './Loader'

const Protected = ({ children }) => {

    const { user, loading, initialized } = useSelector(state => state.auth)

    if (!initialized || loading) {
        return <Loader text="Authenticating..." />
    }


    if (!user) {
        return <Navigate to="/login" replace />
    }

    if(!user.verified){
      return <Navigate to="/verification" replace />
    }

  return children
}

export default Protected