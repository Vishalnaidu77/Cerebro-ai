import React, { useEffect } from 'react'
import Dashboard from '../features/chat/pages/Dashboard'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useSelector } from 'react-redux'
import useAuth from '../features/auth/hooks/useAuth'

const App = () => {

  const { handleGetMe } = useAuth()

  useEffect(() => {
    handleGetMe()
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App