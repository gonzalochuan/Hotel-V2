import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/errorHandler.js'
import { bookingsRouter } from './routes/bookings.js'
import { paymentsRouter } from './routes/payments.js'
import { roomsRouter } from './routes/rooms.js'

export function createApp() {
  const app = express()

  const allowedOrigins = (process.env.CORS_ORIGIN || '*')
    .split(',')
    .map((origin) => origin.trim())

  app.use(
    cors({
      origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
    }),
  )
  app.use(express.json())

  app.get('/health', (_req, res) => res.json({ status: 'ok' }))
  app.use('/api/rooms', roomsRouter)
  app.use('/api/bookings', bookingsRouter)
  app.use('/api/payments', paymentsRouter)

  app.use(errorHandler)

  return app
}
