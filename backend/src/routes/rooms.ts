import { Router } from 'express'
import * as roomsController from '../controllers/roomsController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { upload } from '../middleware/upload.js'

export const roomsRouter = Router()

roomsRouter.get('/', asyncHandler(roomsController.getRooms))
roomsRouter.get('/:id', asyncHandler(roomsController.getRoom))
roomsRouter.post('/', asyncHandler(roomsController.postRoom))
roomsRouter.put('/:id', asyncHandler(roomsController.putRoom))
roomsRouter.delete('/:id', asyncHandler(roomsController.removeRoom))

roomsRouter.post('/:id/images', upload.single('image'), asyncHandler(roomsController.postRoomImage))
roomsRouter.delete('/:id/images/:imageId', asyncHandler(roomsController.removeRoomImage))
