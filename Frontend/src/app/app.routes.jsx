import { createBrowserRouter } from 'react-router'
import Dashboard from '../features/chat/pages/Dashboard'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import VerificationPage from '../features/auth/pages/VerificationPage'
import Protected from './Protected'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected>
            <Dashboard />
        </Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/verification",
        element: <VerificationPage />
    }
])