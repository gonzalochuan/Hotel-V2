import content from '../data/content.json';
import { resolveIcon } from '../data/icons';
import type { LucideIcon } from 'lucide-react';

export type RoomAmenity = {
  icon: LucideIcon;
  label: string;
};

export type RoomOption = {
  id: string;
  name: string;
  roomType: string;
  image: string;
  price: number;
  capacity: number;
  sizeSqm: number;
  description: string;
  features: string[];
  amenities: RoomAmenity[];
};

export type Enhancement = {
  id: string;
  label: string;
  description: string;
  price: number;
  icon: LucideIcon;
};

export const roomOptions: RoomOption[] = content.rooms.map((room) => ({
  ...room,
  amenities: room.amenities.map((amenity) => ({ ...amenity, icon: resolveIcon(amenity.icon) })),
}));

export const enhancements: Enhancement[] = content.enhancements.map((item) => ({
  ...item,
  icon: resolveIcon(item.icon),
}));

export const fromRatePerNight = Math.min(...roomOptions.map((room) => room.price));
