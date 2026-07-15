import { Router } from 'express'
import * as bookingsController from '../controllers/bookingsController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'

export const bookingsRouter = Router()

// Public — checking room availability doesn't need to be scoped to a user.
bookingsRouter.get('/availability', asyncHandler(bookingsController.getAvailability))

bookingsRouter.use(requireAuth)
bookingsRouter.post('/', asyncHandler(bookingsController.postBooking))
bookingsRouter.get('/mine', asyncHandler(bookingsController.getMyBookings))
