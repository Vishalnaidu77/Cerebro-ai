import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        initialized: false
    },

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.initialized = true
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
            state.initialized = true
        }
    }
})

export const { setUser, setLoading, setError } = authSlice.actions
export default authSlice.reducer;