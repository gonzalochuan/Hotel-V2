export interface RoomAmenity {
  icon: string
  label: string
}

export interface RoomImage {
  id: string
  roomId: string
  url: string
  storagePath: string
  isPrimary: boolean
  sortOrder: number
  createdAt: string
}

export interface Room {
  id: string
  name: string
  description: string
  roomType: string
  price: number
  capacity: number
  sizeSqm: number
  features: string[]
  amenities: RoomAmenity[]
  images: RoomImage[]
  createdAt: string
  updatedAt: string
}

export interface RoomInput {
  name: string
  description: string
  roomType: string
  price: number
  capacity: number
  sizeSqm: number
  features?: string[]
  amenities?: RoomAmenity[]
}
