import { createUserScopedClient, supabase } from '../lib/supabaseClient.js'
import { HttpError } from '../middleware/errorHandler.js'
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
  rooms: { name: string; room_images: { url: string; is_primary: boolean; sort_order: number }[] } | null
}

function mapBooking(row: BookingRow): Booking {
  const images = row.rooms?.room_images ?? []
  const primaryImage = [...images].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
  )[0]

  return {
    id: row.id,
    userId: row.user_id,
    roomId: row.room_id,
    roomName: row.rooms?.name ?? null,
    roomImage: primaryImage?.url ?? null,
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

const BOOKING_SELECT = '*, rooms(name, room_images(url, is_primary, sort_order))'

// Uses the service-role client (bypasses the "own bookings only" RLS policy)
// since checking whether a room is free for given dates is a cross-user
// question, not scoped to the requesting user's own bookings.
export async function isRoomAvailable(roomId: string, checkIn: string, checkOut: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_id', roomId)
    .lt('check_in', checkOut)
    .gt('check_out', checkIn)
    .limit(1)

  if (error) throw error
  return data.length === 0
}

export async function createBooking(
  accessToken: string,
  userId: string,
  input: BookingInput,
): Promise<Booking> {
  if (!(await isRoomAvailable(input.roomId, input.checkIn, input.checkOut))) {
    throw new HttpError(409, 'This room is already booked for the selected dates.')
  }

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
    .select(BOOKING_SELECT)
    .single()

  if (error) throw error
  return mapBooking(data as unknown as BookingRow)
}

export async function listMyBookings(accessToken: string): Promise<Booking[]> {
  const client = createUserScopedClient(accessToken)

  const { data, error } = await client
    .from('bookings')
    .select(BOOKING_SELECT)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as unknown as BookingRow[]).map(mapBooking)
}
