import { resolveIcon } from '../data/icons';
import { api } from './api';
import type { RoomOption } from '../constants/bookingContent';

export type ApiRoomImage = {
  id: string;
  roomId: string;
  url: string;
  storagePath: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
};

export type ApiRoomAmenity = {
  icon: string;
  label: string;
};

export type ApiRoom = {
  id: string;
  name: string;
  description: string;
  roomType: string;
  price: number;
  capacity: number;
  sizeSqm: number;
  features: string[];
  amenities: ApiRoomAmenity[];
  images: ApiRoomImage[];
  createdAt: string;
  updatedAt: string;
};

export type RoomFormInput = {
  name: string;
  description: string;
  roomType: string;
  price: number;
  capacity: number;
  sizeSqm: number;
  features: string[];
  amenities: ApiRoomAmenity[];
};

function primaryImageUrl(room: ApiRoom): string {
  const sorted = [...room.images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder);
  return sorted[0]?.url ?? '';
}

export function mapRoomToOption(room: ApiRoom): RoomOption {
  return {
    id: room.id,
    name: room.name,
    roomType: room.roomType,
    image: primaryImageUrl(room),
    price: room.price,
    capacity: room.capacity,
    sizeSqm: room.sizeSqm,
    description: room.description,
    features: room.features,
    amenities: room.amenities.map((amenity) => ({ ...amenity, icon: resolveIcon(amenity.icon) })),
  };
}

export function fetchRooms(): Promise<ApiRoom[]> {
  return api.get<ApiRoom[]>('/rooms');
}

export function fetchRoomById(id: string): Promise<ApiRoom> {
  return api.get<ApiRoom>(`/rooms/${id}`);
}

export function createRoom(input: RoomFormInput): Promise<ApiRoom> {
  return api.post<ApiRoom>('/rooms', input);
}

export function updateRoom(id: string, input: RoomFormInput): Promise<ApiRoom> {
  return api.put<ApiRoom>(`/rooms/${id}`, input);
}

export function deleteRoom(id: string): Promise<void> {
  return api.delete<void>(`/rooms/${id}`);
}

export function uploadRoomImage(roomId: string, file: File): Promise<ApiRoomImage> {
  const formData = new FormData();
  formData.append('image', file);
  return api.post<ApiRoomImage>(`/rooms/${roomId}/images`, formData);
}

export function deleteRoomImage(roomId: string, imageId: string): Promise<void> {
  return api.delete<void>(`/rooms/${roomId}/images/${imageId}`);
}
