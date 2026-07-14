import { Router } from 'express'
import * as bookingsController from '../controllers/bookingsController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'

export const bookingsRouter = Router()

bookingsRouter.use(requireAuth)
bookingsRouter.post('/', asyncHandler(bookingsController.postBooking))
bookingsRouter.get('/mine', asyncHandler(bookingsController.getMyBookings))
