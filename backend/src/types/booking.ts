export interface BookingEnhancement {
  id: string
  label: string
  price: number
}

export interface Booking {
  id: string
  userId: string
  roomId: string | null
  roomName: string | null
  roomImage: string | null
  checkIn: string
  checkOut: string
  adults: number
  children: number
  roomsCount: number
  enhancements: BookingEnhancement[]
  subtotal: number
  taxes: number
  total: number
  status: string
  createdAt: string
}

export interface BookingInput {
  roomId: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  roomsCount: number
  enhancements?: BookingEnhancement[]
  subtotal: number
  taxes: number
  total: number
}
