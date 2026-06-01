import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/auth/auth.slice.js'
import chatSlice from '../features/chat/chat.slice.js'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        chat: chatSlice
    }
})