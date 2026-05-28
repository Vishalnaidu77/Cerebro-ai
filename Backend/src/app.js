import express from 'express'
import connectToDb from './config/database.js'
import authRouter from './routes/auth.route.js'

const app = express()
connectToDb()

app.use(express.json())

app.use('/api/auth', authRouter)

export default app