import express from 'express'
import authRouter from './routes/auth.route.js'
import aiRouter from './routes/chat.routes.js'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.get('/health', (req, res) => {
    res.json({ message: "Server is running"})
})

app.use('/api/auth', authRouter)
app.use('/api/ai', aiRouter)

export default app