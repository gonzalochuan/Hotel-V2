import type { Request, Response } from 'express'
import { HttpError } from '../middleware/errorHandler.js'
import * as paymentsService from '../services/paymentsService.js'

export async function postPaymentIntent(req: Request, res: Response) {
  const { amount } = req.body as { amount?: unknown }

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    throw new HttpError(400, 'amount must be a positive number (in PHP)')
  }

  const amountCentavos = Math.round(amount * 100)
  const intent = await paymentsService.createPaymentIntent(amountCentavos)
  res.status(201).json(intent)
}
