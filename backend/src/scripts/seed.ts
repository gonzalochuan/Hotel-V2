import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createRoom, addRoomImage } from '../services/roomsService.js'
import type { RoomInput } from '../types/room.js'

const PUBLIC_IMAGE_DIR = path.resolve(process.cwd(), '../public/image')

const SEED_ROOMS: (RoomInput & { imageFile: string })[] = [
  {
    imageFile: 'hotel.jpg',
    name: 'Palawan Pool Suite',
    roomType: 'Suite',
    price: 8900,
    capacity: 2,
    sizeSqm: 34,
    description: 'Private plunge pool suite with a shaded lanai and ocean glimpses.',
    features: [
      'Ocean side, average 34 sqm',
      'King bed',
      'Bathtub and rain shower',
      'Private plunge pool',
      'Connecting room available on request',
    ],
    amenities: [
      { icon: 'Tv', label: '55" LED TV' },
      { icon: 'Bluetooth', label: 'Bluetooth Speaker' },
      { icon: 'Mountain', label: 'Ocean View' },
      { icon: 'PawPrint', label: 'Pet Friendly' },
      { icon: 'Wine', label: 'Minibar' },
      { icon: 'Usb', label: 'USB/Charger' },
      { icon: 'Wifi', label: 'WiFi' },
      { icon: 'Maximize2', label: 'Average Room Size 34 sqm' },
    ],
  },
  {
    imageFile: 'hotel2.jpg',
    name: 'Siargao Garden Room',
    roomType: 'Room',
    price: 6400,
    capacity: 2,
    sizeSqm: 26,
    description: 'Ground-floor room opening straight onto tropical gardens.',
    features: ['Garden side, average 26 sqm', 'King or twin bed', 'Bathtub or shower', 'No balcony', 'No rollaway beds'],
    amenities: [
      { icon: 'Tv', label: '48" LED TV' },
      { icon: 'Bluetooth', label: 'Bluetooth Speaker' },
      { icon: 'Mountain', label: 'Garden View' },
      { icon: 'PawPrint', label: 'Pet Friendly' },
      { icon: 'Wine', label: 'Minibar' },
      { icon: 'Usb', label: 'USB/Charger' },
      { icon: 'Wifi', label: 'WiFi' },
      { icon: 'Maximize2', label: 'Average Room Size 26 sqm' },
    ],
  },
  {
    imageFile: 'hotel3.jpg',
    name: 'Bohol Cliff House',
    roomType: 'House',
    price: 7200,
    capacity: 4,
    sizeSqm: 52,
    description: 'Two-storey house with panoramic sea views and a private deck.',
    features: [
      'Cliffside, average 52 sqm',
      'Two king beds',
      'Bathtub and rain shower',
      'Private deck with sea view',
      'Rollaway bed available',
    ],
    amenities: [
      { icon: 'Tv', label: '55" LED TV' },
      { icon: 'Bluetooth', label: 'Bluetooth Speaker' },
      { icon: 'Mountain', label: 'Sea View' },
      { icon: 'PawPrint', label: 'Pet Friendly' },
      { icon: 'Wine', label: 'Minibar' },
      { icon: 'Usb', label: 'USB/Charger' },
      { icon: 'Wifi', label: 'WiFi' },
      { icon: 'Maximize2', label: 'Average Room Size 52 sqm' },
    ],
  },
  {
    imageFile: 'hotel4.jpg',
    name: 'Private Pool Villa',
    roomType: 'Villa',
    price: 12500,
    capacity: 4,
    sizeSqm: 68,
    description: 'Standalone villa with a dedicated butler and full island privacy.',
    features: [
      'Beachfront, average 68 sqm',
      'King bed plus daybed',
      'Outdoor rain shower',
      'Private infinity pool',
      'Dedicated butler service',
    ],
    amenities: [
      { icon: 'Tv', label: '65" LED TV' },
      { icon: 'Bluetooth', label: 'Bluetooth Speaker' },
      { icon: 'Mountain', label: 'Beach View' },
      { icon: 'PawPrint', label: 'Pet Friendly' },
      { icon: 'Wine', label: 'Minibar' },
      { icon: 'Usb', label: 'USB/Charger' },
      { icon: 'Wifi', label: 'WiFi' },
      { icon: 'Maximize2', label: 'Average Room Size 68 sqm' },
    ],
  },
]

async function seed() {
  for (const { imageFile, ...roomInput } of SEED_ROOMS) {
    const room = await createRoom(roomInput)
    console.log(`Created room "${room.name}" (${room.id})`)

    const buffer = await readFile(path.join(PUBLIC_IMAGE_DIR, imageFile))
    await addRoomImage(room.id, { buffer, mimetype: 'image/jpeg', originalname: imageFile })
    console.log(`  uploaded image ${imageFile}`)
  }
}

seed()
  .then(() => {
    console.log('Seed complete.')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
