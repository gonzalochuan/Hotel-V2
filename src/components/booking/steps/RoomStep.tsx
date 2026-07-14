import { ChevronDown, ChevronLeft, Check, Expand, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { roomOptions } from '../../../constants/bookingContent';

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatDate(date: Date | null) {
  if (!date) return '—';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

type RoomStepProps = {
  arrival: Date | null;
  departure: Date | null;
  adults: number;
  childrenCount: number;
  onChangeAdults: (value: number) => void;
  onChangeChildren: (value: number) => void;
  onEditDates: () => void;
  onSelectRoom: (id: string) => void;
};

export function RoomStep({
  arrival,
  departure,
  adults,
  childrenCount,
  onChangeAdults,
  onChangeChildren,
  onEditDates,
  onSelectRoom,
}: RoomStepProps) {
  const [roomType, setRoomType] = useState('All room types');
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  const roomTypes = useMemo(() => ['All room types', ...new Set(roomOptions.map((room) => room.roomType))], []);
  const visibleRooms =
    roomType === 'All room types' ? roomOptions : roomOptions.filter((room) => room.roomType === roomType);

  return (
    <div className="mx-auto max-w-[1680px] sm:px-8 lg:px-14">
      <div className="flex flex-col gap-3 border-b border-ink/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-0">
        <button
          type="button"
          onClick={onEditDates}
          className="flex items-center gap-1 text-sm font-bold uppercase tracking-[0.1em] underline decoration-ink/30 underline-offset-4 hover:text-palm"
        >
          <ChevronLeft size={16} /> Edit
        </button>
        <p className="text-sm uppercase tracking-[0.1em] text-ink/70">
          Arrive: {formatDate(arrival)} <span className="mx-2 text-ink/30">|</span> Depart: {formatDate(departure)}
        </p>
        <span className="hidden text-sm text-ink/40 sm:block">{MONTH_LABELS[new Date().getMonth()]}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-ink/10 px-5 py-5 sm:px-0">
        <span className="text-sm font-medium text-ink/60">Select room for</span>
        <span className="relative inline-flex">
          <select
            value={adults}
            onChange={(event) => onChangeAdults(Number(event.target.value))}
            className="appearance-none rounded-full border border-ink/15 bg-linen py-2 pl-4 pr-8 text-sm outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((count) => (
              <option key={count} value={count}>
                {count} Adult{count > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/45"
          />
        </span>
        <span className="relative inline-flex">
          <select
            value={childrenCount}
            onChange={(event) => onChangeChildren(Number(event.target.value))}
            className="appearance-none rounded-full border border-ink/15 bg-linen py-2 pl-4 pr-8 text-sm outline-none"
          >
            {[0, 1, 2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count} Child{count === 1 ? '' : 'ren'}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/45"
          />
        </span>
        <input
          placeholder="Promo / Group code"
          className="rounded-full border border-ink/15 bg-linen px-4 py-2 text-sm outline-none placeholder:text-ink/40"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 px-5 py-5 sm:px-0">
        <span className="text-sm font-medium text-ink/60">Filter</span>
        <span className="relative inline-flex">
          <select
            value={roomType}
            onChange={(event) => setRoomType(event.target.value)}
            className="appearance-none rounded-full border border-ink/15 bg-linen py-2 pl-4 pr-8 text-sm outline-none"
          >
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/45"
          />
        </span>
        <span className="relative inline-flex">
          <select
            className="appearance-none rounded-full border border-ink/15 bg-linen py-2 pl-4 pr-8 text-sm text-ink/60 outline-none"
            disabled
          >
            <option>Balcony/Terrace</option>
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/35"
          />
        </span>
        <span className="relative inline-flex">
          <select
            className="appearance-none rounded-full border border-ink/15 bg-linen py-2 pl-4 pr-8 text-sm text-ink/60 outline-none"
            disabled
          >
            <option>View</option>
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/35"
          />
        </span>
        <span className="relative inline-flex">
          <select
            className="appearance-none rounded-full border border-ink/15 bg-linen py-2 pl-4 pr-8 text-sm text-ink/60 outline-none"
            disabled
          >
            <option>Rollaway Bed</option>
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/35"
          />
        </span>
      </div>

      <div className="flex flex-col divide-y divide-ink/10 border-t border-ink/10 px-5 sm:px-0">
        {visibleRooms.map((room) => (
          <div key={room.id} className="grid gap-8 py-10 lg:grid-cols-[1fr_1.25fr]">
            <button
              type="button"
              onClick={() => setPreviewImage({ src: room.image, alt: room.name })}
              className="group relative h-72 overflow-hidden rounded-[1.25rem] lg:h-full"
              aria-label={`View larger photo of ${room.name}`}
            >
              <img
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                src={room.image}
                alt={room.name}
                loading="lazy"
              />
              <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-linen/85 text-ink backdrop-blur transition group-hover:bg-linen">
                <Expand size={16} strokeWidth={2} />
              </span>
            </button>

            <div className="flex flex-col">
              <h3 className="text-2xl font-light uppercase leading-tight sm:text-3xl">{room.name}</h3>
              <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-ink/75 sm:grid-cols-2">
                {room.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={15} className="mt-0.5 shrink-0 text-ink/50" strokeWidth={2.5} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid grid-cols-4 gap-x-6 gap-y-5 border-t border-ink/10 pt-6 lg:grid-cols-8">
                {room.amenities.map((amenity) => (
                  <div key={amenity.label} className="flex flex-col items-center gap-2 text-center">
                    <amenity.icon size={20} className="text-ink/45" strokeWidth={1.6} />
                    <span className="text-[0.65rem] leading-tight text-ink/50">{amenity.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-end justify-between gap-6 border-t border-ink/10 pt-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-ink/50">From</p>
                  <p className="text-2xl font-light">
                    PHP {room.price.toLocaleString('en-PH')}
                    <span className="text-sm text-ink/50"> / Night</span>
                  </p>
                  <p className="text-xs text-ink/45">incl. Taxes &amp; Fees</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectRoom(room.id)}
                  className="h-12 shrink-0 rounded-full bg-ink px-8 text-sm font-bold uppercase tracking-[0.1em] text-linen transition hover:bg-palm"
                >
                  View Rates
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewImage ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 p-6 backdrop-blur"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            aria-label="Close preview"
            className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full border border-linen/25 text-linen transition hover:bg-linen hover:text-ink"
          >
            <X size={20} strokeWidth={2} />
          </button>
          <img
            src={previewImage.src}
            alt={previewImage.alt}
            className="max-h-[85vh] max-w-[90vw] rounded-[1rem] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
