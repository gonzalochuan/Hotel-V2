import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { enhancements, roomOptions } from '../../../constants/bookingContent';
import type { GuestDetails } from './DetailsStep';

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
  return `${date.getDate()} ${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

type ConfirmationStepProps = {
  arrival: Date | null;
  departure: Date | null;
  rooms: number;
  adults: number;
  childrenCount: number;
  roomId: string | null;
  selectedEnhancements: string[];
  guestDetails: GuestDetails;
  onBack: () => void;
  onClose: () => void;
};

export function ConfirmationStep({
  arrival,
  departure,
  rooms,
  adults,
  childrenCount,
  roomId,
  selectedEnhancements,
  guestDetails,
  onBack,
  onClose,
}: ConfirmationStepProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const room = roomOptions.find((option) => option.id === roomId) ?? roomOptions[0];
  const nights =
    arrival && departure ? Math.round((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const pickedEnhancements = enhancements.filter((item) => selectedEnhancements.includes(item.id));
  const enhancementsTotal = pickedEnhancements.reduce((sum, item) => sum + item.price, 0);
  const total = nights * room.price * rooms + enhancementsTotal;

  if (isConfirmed) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-5 py-10 text-center sm:px-8">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-palm text-linen">
          <CheckCircle2 size={26} />
        </span>
        <h3 className="text-3xl font-light uppercase leading-none">Booking confirmed</h3>
        <p className="max-w-sm text-sm text-ink/65">
          A confirmation has been sent to {guestDetails.email || 'your email'}. We look forward to welcoming you,{' '}
          {guestDetails.name || 'guest'}.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 h-12 rounded-full bg-ink px-8 text-sm font-bold text-linen transition hover:bg-palm"
        >
          Back to site
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1680px] px-5 py-6 sm:px-8 lg:px-14">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-bold uppercase tracking-[0.1em] underline decoration-ink/30 underline-offset-4 hover:text-palm"
      >
        <ChevronLeft size={16} /> Back to enhancements &amp; details
      </button>

      <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-palm">Review &amp; confirm</p>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-[1.5rem] border border-ink/12">
            <div className="h-56 sm:h-72">
              <img className="h-full w-full object-cover" src={room.image} alt={room.name} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
              <div>
                <p className="text-2xl font-light uppercase leading-tight">{room.name}</p>
                <p className="mt-1 text-sm text-ink/60">
                  {rooms} room{rooms > 1 ? 's' : ''} · {adults} adult{adults > 1 ? 's' : ''}
                  {childrenCount > 0 ? ` · ${childrenCount} child${childrenCount > 1 ? 'ren' : ''}` : ''}
                </p>
              </div>
              <p className="text-sm font-bold text-ink/70">PHP {room.price.toLocaleString('en-PH')} / night</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 rounded-[1.5rem] border border-ink/12 p-5 sm:p-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/50">Arrival</p>
              <p className="mt-1 text-lg">{formatDate(arrival)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/50">Departure</p>
              <p className="mt-1 text-lg">{formatDate(departure)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/50">Guest</p>
              <p className="mt-1 text-lg leading-tight">{guestDetails.name || '—'}</p>
              <p className="text-sm text-ink/60">{guestDetails.email || '—'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-[1.5rem] border border-ink/12 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/50">
            Enhancements {pickedEnhancements.length > 0 ? `(${pickedEnhancements.length})` : ''}
          </p>
          {pickedEnhancements.length > 0 ? (
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {pickedEnhancements.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-ink/75">
                  <span>{item.label}</span>
                  <span>{item.price > 0 ? `PHP ${item.price.toLocaleString('en-PH')}` : 'Included'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-ink/50">None selected</p>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-5">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-ink/50">
              Total, {nights} night{nights !== 1 ? 's' : ''}
            </p>
            <p className="text-2xl font-light">PHP {total.toLocaleString('en-PH')}</p>
          </div>

          <button
            type="button"
            onClick={() => setIsConfirmed(true)}
            className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ink text-base font-bold text-linen transition hover:bg-palm"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
