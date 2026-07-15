import { Router } from 'express'
import * as paymentsController from '../controllers/paymentsController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'

export const paymentsRouter = Router()

paymentsRouter.use(requireAuth)
paymentsRouter.post('/intent', asyncHandler(paymentsController.postPaymentIntent))
