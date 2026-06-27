import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './config/db.js'
import chatRoutes from './routes/chatRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/chats', chatRoutes)

connectDB()

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
