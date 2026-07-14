import { createUserScopedClient } from '../lib/supabaseClient.js'
import type { Booking, BookingInput } from '../types/booking.js'

interface BookingRow {
  id: string
  user_id: string
  room_id: string | null
  check_in: string
  check_out: string
  adults: number
  children: number
  rooms_count: number
  enhancements: { id: string; label: string; price: number }[]
  subtotal: number
  taxes: number
  total: number
  status: string
  created_at: string
}

function mapBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    roomId: row.room_id,
    checkIn: row.check_in,
    checkOut: row.check_out,
    adults: row.adults,
    children: row.children,
    roomsCount: row.rooms_count,
    enhancements: row.enhancements ?? [],
    subtotal: Number(row.subtotal),
    taxes: Number(row.taxes),
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at,
  }
}

export async function createBooking(
  accessToken: string,
  userId: string,
  input: BookingInput,
): Promise<Booking> {
  const client = createUserScopedClient(accessToken)

  const { data, error } = await client
    .from('bookings')
    .insert({
      user_id: userId,
      room_id: input.roomId,
      check_in: input.checkIn,
      check_out: input.checkOut,
      adults: input.adults,
      children: input.children,
      rooms_count: input.roomsCount,
      enhancements: input.enhancements ?? [],
      subtotal: input.subtotal,
      taxes: input.taxes,
      total: input.total,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapBooking(data as BookingRow)
}

export async function listMyBookings(accessToken: string): Promise<Booking[]> {
  const client = createUserScopedClient(accessToken)

  const { data, error } = await client
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as BookingRow[]).map(mapBooking)
}
