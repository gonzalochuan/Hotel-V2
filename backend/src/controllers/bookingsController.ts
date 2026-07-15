import type { Request, Response } from 'express'
import { HttpError } from '../middleware/errorHandler.js'
import * as bookingsService from '../services/bookingsService.js'
import { sendBookingConfirmationEmail } from '../services/emailService.js'
import type { BookingInput } from '../types/booking.js'

function parseBookingInput(body: Record<string, unknown>): BookingInput {
  const { roomId, checkIn, checkOut, adults, children, roomsCount, enhancements, subtotal, taxes, total } =
    body

  if (typeof roomId !== 'string' || !roomId.trim()) throw new HttpError(400, 'roomId is required')
  if (typeof checkIn !== 'string' || !checkIn.trim()) throw new HttpError(400, 'checkIn is required')
  if (typeof checkOut !== 'string' || !checkOut.trim()) throw new HttpError(400, 'checkOut is required')
  if (typeof adults !== 'number' || !Number.isInteger(adults) || adults < 1)
    throw new HttpError(400, 'adults must be a positive integer')
  if (typeof children !== 'number' || !Number.isInteger(children) || children < 0)
    throw new HttpError(400, 'children must be a non-negative integer')
  if (typeof roomsCount !== 'number' || !Number.isInteger(roomsCount) || roomsCount < 1)
    throw new HttpError(400, 'roomsCount must be a positive integer')
  if (typeof subtotal !== 'number' || subtotal < 0) throw new HttpError(400, 'subtotal must be a non-negative number')
  if (typeof taxes !== 'number' || taxes < 0) throw new HttpError(400, 'taxes must be a non-negative number')
  if (typeof total !== 'number' || total < 0) throw new HttpError(400, 'total must be a non-negative number')

  return {
    roomId,
    checkIn,
    checkOut,
    adults,
    children,
    roomsCount,
    enhancements: Array.isArray(enhancements)
      ? enhancements.filter(
          (e): e is { id: string; label: string; price: number } =>
            !!e && typeof e.id === 'string' && typeof e.label === 'string' && typeof e.price === 'number',
        )
      : [],
    subtotal,
    taxes,
    total,
  }
}

export async function postBooking(req: Request, res: Response) {
  const input = parseBookingInput(req.body)
  const booking = await bookingsService.createBooking(req.accessToken!, req.user!.id, input)
  res.status(201).json(booking)

  const email = req.user!.email
  if (email) {
    sendBookingConfirmationEmail({ to: email, roomName: booking.roomName ?? 'Your room', booking }).catch((err) => {
      console.error('Failed to send booking confirmation email:', err)
    })
  }
}

export async function getMyBookings(req: Request, res: Response) {
  const bookings = await bookingsService.listMyBookings(req.accessToken!)
  res.json(bookings)
}

export async function getAvailability(req: Request, res: Response) {
  const { roomId, checkIn, checkOut } = req.query

  if (typeof roomId !== 'string' || !roomId.trim()) throw new HttpError(400, 'roomId is required')
  if (typeof checkIn !== 'string' || !checkIn.trim()) throw new HttpError(400, 'checkIn is required')
  if (typeof checkOut !== 'string' || !checkOut.trim()) throw new HttpError(400, 'checkOut is required')

  const available = await bookingsService.isRoomAvailable(roomId, checkIn, checkOut)
  res.json({ available })
}
