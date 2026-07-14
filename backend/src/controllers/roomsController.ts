import type { Request, Response } from 'express'
import { HttpError } from '../middleware/errorHandler.js'
import * as roomsService from '../services/roomsService.js'
import type { RoomInput } from '../types/room.js'

function parseRoomInput(body: Record<string, unknown>): RoomInput {
  const { name, description, roomType, price, capacity, sizeSqm, features, amenities } = body

  if (typeof name !== 'string' || !name.trim()) throw new HttpError(400, 'name is required')
  if (typeof description !== 'string' || !description.trim())
    throw new HttpError(400, 'description is required')
  if (typeof roomType !== 'string' || !roomType.trim()) throw new HttpError(400, 'roomType is required')
  if (typeof price !== 'number' || Number.isNaN(price) || price < 0)
    throw new HttpError(400, 'price must be a non-negative number')
  if (typeof capacity !== 'number' || !Number.isInteger(capacity) || capacity < 1)
    throw new HttpError(400, 'capacity must be a positive integer')
  if (typeof sizeSqm !== 'number' || Number.isNaN(sizeSqm) || sizeSqm < 0)
    throw new HttpError(400, 'sizeSqm must be a non-negative number')

  return {
    name: name.trim(),
    description: description.trim(),
    roomType: roomType.trim(),
    price,
    capacity,
    sizeSqm,
    features: Array.isArray(features) ? features.filter((f) => typeof f === 'string') : [],
    amenities: Array.isArray(amenities)
      ? amenities.filter(
          (a): a is { icon: string; label: string } =>
            !!a && typeof a.icon === 'string' && typeof a.label === 'string',
        )
      : [],
  }
}

export async function getRooms(req: Request, res: Response) {
  const roomType = typeof req.query.roomType === 'string' ? req.query.roomType : undefined
  const rooms = await roomsService.listRooms(roomType)
  res.json(rooms)
}

export async function getRoom(req: Request, res: Response) {
  const room = await roomsService.getRoomById(req.params.id)
  if (!room) throw new HttpError(404, 'Room not found')
  res.json(room)
}

export async function postRoom(req: Request, res: Response) {
  const input = parseRoomInput(req.body)
  const room = await roomsService.createRoom(input)
  res.status(201).json(room)
}

export async function putRoom(req: Request, res: Response) {
  const existing = await roomsService.getRoomById(req.params.id)
  if (!existing) throw new HttpError(404, 'Room not found')

  const merged = parseRoomInput({ ...existing, ...req.body })
  const room = await roomsService.updateRoom(req.params.id, merged)
  res.json(room)
}

export async function removeRoom(req: Request, res: Response) {
  const deleted = await roomsService.deleteRoom(req.params.id)
  if (!deleted) throw new HttpError(404, 'Room not found')
  res.status(204).send()
}

export async function postRoomImage(req: Request, res: Response) {
  const room = await roomsService.getRoomById(req.params.id)
  if (!room) throw new HttpError(404, 'Room not found')

  const file = req.file
  if (!file) throw new HttpError(400, 'image file is required')

  const image = await roomsService.addRoomImage(req.params.id, {
    buffer: file.buffer,
    mimetype: file.mimetype,
    originalname: file.originalname,
  })
  res.status(201).json(image)
}

export async function removeRoomImage(req: Request, res: Response) {
  const deleted = await roomsService.deleteRoomImage(req.params.id, req.params.imageId)
  if (!deleted) throw new HttpError(404, 'Image not found')
  res.status(204).send()
}
