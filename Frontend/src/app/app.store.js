import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/auth/auth.slice.js'

export const store = configureStore({
    reducer: {
        auth: authSlice
    }
})