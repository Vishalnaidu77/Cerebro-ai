import React from 'react'
import { getMe, login, register, resendEmail } from '../services/auth.api'
import { useDispatch } from 'react-redux'
import { setError, setLoading, setUser } from '../auth.slice'

const useAuth = () => {

    const dispatch = useDispatch()

    const handleRegister = async (username, email, password) => {
        try {
            dispatch(setLoading(true))
            const res = await register(username, email, password)
            dispatch(setUser(res))
        } catch (err) {
            dispatch(setError(err.response?.data?.message))
        } finally{
            dispatch(setLoading(false))
        }
    }

    const handleLogin = async (email, password) => {
       try {
        dispatch(setLoading(true))
        const res = await login(email, password)
        dispatch(setUser(res))
       } catch (err) {
        dispatch(setError(err.response?.data?.message))
       } finally{
        dispatch(setLoading(false))
       }
    }

    const handleGetMe = async () => {
        try {
            dispatch(setLoading(true))
            const res = await getMe()
            dispatch(setUser(res.user))
        } catch (err) {
            dispatch(setError(null))
        } finally{
            dispatch(setLoading(false))
        }
    }

    const handleResendEmail = async (email) => {
        try {
            dispatch(setLoading(true))
            const res = await resendEmail(email)
            return res
        } catch (err) {
            dispatch(setError(`Error resend verification mail: ${err}`))
        } finally{
            dispatch(setLoading(false))
        }
    }


  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleResendEmail
  }
}

export default useAuth