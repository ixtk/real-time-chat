import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chats', chatRoutes)

connectDB()

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
