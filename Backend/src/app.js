import express from 'express'
import connectToDb from './config/database.js'
import authRouter from './routes/auth.route.js'
import aiRouter from './routes/chat.routes.js'

const app = express()
connectToDb()

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/ai', aiRouter)

export default app