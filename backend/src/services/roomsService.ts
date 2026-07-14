import { randomUUID } from 'node:crypto'
import { supabase, ROOM_IMAGES_BUCKET } from '../lib/supabaseClient.js'
import type { Room, RoomImage, RoomInput } from '../types/room.js'

interface RoomRow {
  id: string
  name: string
  description: string
  room_type: string
  price: number
  capacity: number
  size_sqm: number
  features: string[] | null
  amenities: { icon: string; label: string }[] | null
  created_at: string
  updated_at: string
}

interface RoomImageRow {
  id: string
  room_id: string
  storage_path: string
  url: string
  is_primary: boolean
  sort_order: number
  created_at: string
}

function mapImage(row: RoomImageRow): RoomImage {
  return {
    id: row.id,
    roomId: row.room_id,
    url: row.url,
    storagePath: row.storage_path,
    isPrimary: row.is_primary,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }
}

function mapRoom(row: RoomRow, images: RoomImageRow[]): Room {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    roomType: row.room_type,
    price: Number(row.price),
    capacity: row.capacity,
    sizeSqm: Number(row.size_sqm),
    features: row.features ?? [],
    amenities: row.amenities ?? [],
    images: images
      .filter((image) => image.room_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapImage),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function fetchImagesForRooms(roomIds: string[]): Promise<RoomImageRow[]> {
  if (roomIds.length === 0) return []
  const { data, error } = await supabase
    .from('room_images')
    .select('*')
    .in('room_id', roomIds)
  if (error) throw error
  return data as RoomImageRow[]
}

export async function listRooms(roomType?: string): Promise<Room[]> {
  let query = supabase.from('rooms').select('*').order('created_at', { ascending: true })
  if (roomType) query = query.eq('room_type', roomType)

  const { data, error } = await query
  if (error) throw error

  const rows = data as RoomRow[]
  const images = await fetchImagesForRooms(rows.map((row) => row.id))
  return rows.map((row) => mapRoom(row, images))
}

export async function getRoomById(id: string): Promise<Room | null> {
  const { data, error } = await supabase.from('rooms').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) return null

  const images = await fetchImagesForRooms([id])
  return mapRoom(data as RoomRow, images)
}

export async function createRoom(input: RoomInput): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .insert({
      name: input.name,
      description: input.description,
      room_type: input.roomType,
      price: input.price,
      capacity: input.capacity,
      size_sqm: input.sizeSqm,
      features: input.features ?? [],
      amenities: input.amenities ?? [],
    })
    .select('*')
    .single()

  if (error) throw error
  return mapRoom(data as RoomRow, [])
}

export async function updateRoom(id: string, input: Partial<RoomInput>): Promise<Room | null> {
  const updatePayload: Record<string, unknown> = {}
  if (input.name !== undefined) updatePayload.name = input.name
  if (input.description !== undefined) updatePayload.description = input.description
  if (input.roomType !== undefined) updatePayload.room_type = input.roomType
  if (input.price !== undefined) updatePayload.price = input.price
  if (input.capacity !== undefined) updatePayload.capacity = input.capacity
  if (input.sizeSqm !== undefined) updatePayload.size_sqm = input.sizeSqm
  if (input.features !== undefined) updatePayload.features = input.features
  if (input.amenities !== undefined) updatePayload.amenities = input.amenities
  updatePayload.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('rooms')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const images = await fetchImagesForRooms([id])
  return mapRoom(data as RoomRow, images)
}

export async function deleteRoom(id: string): Promise<boolean> {
  const { data: images, error: imagesError } = await supabase
    .from('room_images')
    .select('storage_path')
    .eq('room_id', id)
  if (imagesError) throw imagesError

  const paths = (images as { storage_path: string }[]).map((image) => image.storage_path)
  if (paths.length > 0) {
    const { error: removeError } = await supabase.storage.from(ROOM_IMAGES_BUCKET).remove(paths)
    if (removeError) throw removeError
  }

  const { error, count } = await supabase.from('rooms').delete({ count: 'exact' }).eq('id', id)
  if (error) throw error
  return (count ?? 0) > 0
}

export async function addRoomImage(
  roomId: string,
  file: { buffer: Buffer; mimetype: string; originalname: string },
): Promise<RoomImage> {
  const extension = file.originalname.split('.').pop() || 'jpg'
  const storagePath = `${roomId}/${randomUUID()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from(ROOM_IMAGES_BUCKET)
    .upload(storagePath, file.buffer, { contentType: file.mimetype, upsert: false })
  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage.from(ROOM_IMAGES_BUCKET).getPublicUrl(storagePath)

  const { data, error } = await supabase
    .from('room_images')
    .insert({
      room_id: roomId,
      storage_path: storagePath,
      url: publicUrlData.publicUrl,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapImage(data as RoomImageRow)
}

export async function deleteRoomImage(roomId: string, imageId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('room_images')
    .select('storage_path')
    .eq('id', imageId)
    .eq('room_id', roomId)
    .maybeSingle()
  if (error) throw error
  if (!data) return false

  const { storage_path } = data as { storage_path: string }
  const { error: removeError } = await supabase.storage.from(ROOM_IMAGES_BUCKET).remove([storage_path])
  if (removeError) throw removeError

  const { error: deleteError } = await supabase.from('room_images').delete().eq('id', imageId)
  if (deleteError) throw deleteError
  return true
}
