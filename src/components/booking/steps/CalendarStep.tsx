import { ChevronDown, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRoomsCatalog } from '../../../context/RoomsCatalogContext';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function getMonthCells(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  return cells;
}

function formatMoney(value: number) {
  return `PHP ${value.toLocaleString('en-PH')}`;
}

type CalendarStepProps = {
  arrival: Date | null;
  departure: Date | null;
  onSelectRange: (arrival: Date | null, departure: Date | null) => void;
  rooms: number;
  adults: number;
  childrenCount: number;
  onChangeRooms: (value: number) => void;
  onChangeAdults: (value: number) => void;
  onChangeChildren: (value: number) => void;
  promoCode: string;
  onChangePromoCode: (value: string) => void;
  groupCode: string;
  onChangeGroupCode: (value: string) => void;
  onContinue: () => void;
};

function MonthGrid({
  year,
  month,
  today,
  arrival,
  departure,
  onPick,
  fromRatePerNight,
}: {
  year: number;
  month: number;
  today: Date;
  arrival: Date | null;
  departure: Date | null;
  onPick: (date: Date) => void;
  fromRatePerNight: number;
}) {
  const cells = getMonthCells(year, month);

  return (
    <div className="flex-1">
      <p className="mb-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-ink">
        {MONTH_LABELS[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-[0.08em] text-ink/45">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="py-2">
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, index) => {
          if (!date) return <div key={index} />;

          const isPast = date < today;
          const isArrival = arrival && date.getTime() === arrival.getTime();
          const isDeparture = departure && date.getTime() === departure.getTime();
          const isInRange =
            arrival && departure && date.getTime() > arrival.getTime() && date.getTime() < departure.getTime();
          const isSelected = isArrival || isDeparture || isInRange;

          return (
            <button
              key={index}
              type="button"
              disabled={isPast}
              onClick={() => onPick(date)}
              className={`flex aspect-square flex-col items-center justify-center rounded-md text-sm transition ${
                isPast
                  ? 'cursor-not-allowed text-ink/25 line-through'
                  : isSelected
                    ? 'bg-moss font-bold text-linen'
                    : 'text-ink hover:bg-ink/8'
              }`}
            >
              <span>{date.getDate()}</span>
              {isSelected && !isPast ? (
                <span className="text-[0.6rem] font-normal leading-none opacity-80">
                  {fromRatePerNight.toLocaleString('en-PH')}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarStep({
  arrival,
  departure,
  onSelectRange,
  rooms,
  adults,
  childrenCount,
  onChangeRooms,
  onChangeAdults,
  onChangeChildren,
  promoCode,
  onChangePromoCode,
  groupCode,
  onChangeGroupCode,
  onContinue,
}: CalendarStepProps) {
  const { fromRatePerNight } = useRoomsCatalog();
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const secondMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);

  const handlePick = (date: Date) => {
    if (!arrival || (arrival && departure)) {
      onSelectRange(date, null);
      return;
    }
    if (date.getTime() <= arrival.getTime()) {
      onSelectRange(date, null);
      return;
    }
    onSelectRange(arrival, date);
  };

  const nights =
    arrival && departure ? Math.round((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const total = nights * fromRatePerNight * rooms;

  return (
    <div className="mx-auto grid max-w-[1680px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.6fr_1fr] lg:px-14">
      <div className="rounded-[1.5rem] border border-ink/12 bg-linen p-6 sm:p-8">
        <div className="flex items-start justify-between gap-8">
          <MonthGrid
            year={viewDate.getFullYear()}
            month={viewDate.getMonth()}
            today={today}
            arrival={arrival}
            departure={departure}
            onPick={handlePick}
            fromRatePerNight={fromRatePerNight}
          />
          <button
            type="button"
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
            className="mt-2 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/20 text-ink transition hover:bg-ink hover:text-linen"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
          <MonthGrid
            year={secondMonth.getFullYear()}
            month={secondMonth.getMonth()}
            today={today}
            arrival={arrival}
            departure={departure}
            onPick={handlePick}
            fromRatePerNight={fromRatePerNight}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink/10 pt-6 text-xs text-ink/60">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-moss" /> Selected dates
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-ink/25" /> Available
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-ink/25 text-ink/25 line-through" /> No availability
          </span>
          {arrival || departure ? (
            <button
              type="button"
              onClick={() => onSelectRange(null, null)}
              className="ml-auto font-bold uppercase tracking-[0.15em] text-ink underline decoration-ink/30 underline-offset-4 hover:text-palm"
            >
              Modify reservation
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-[1.25rem] border border-ink/12 p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">Arrival</p>
            <p className="mt-2 text-4xl font-light">{arrival ? arrival.getDate() : '—'}</p>
            <p className="text-xs uppercase tracking-[0.15em] text-ink/50">
              {arrival ? MONTH_LABELS[arrival.getMonth()] : 'Select date'}
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-ink/12 p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">Departure</p>
            <p className="mt-2 text-4xl font-light">{departure ? departure.getDate() : '—'}</p>
            <p className="text-xs uppercase tracking-[0.15em] text-ink/50">
              {departure ? MONTH_LABELS[departure.getMonth()] : 'Select date'}
            </p>
          </div>
        </div>

        <label className="relative flex flex-col gap-1 rounded-[1.25rem] border border-ink/12 bg-linen p-5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">Rooms</span>
          <select
            value={rooms}
            onChange={(event) => onChangeRooms(Number(event.target.value))}
            className="bg-linen text-lg font-medium text-ink outline-none appearance-none"
            style={{ paddingRight: '2.5rem' }}
          >
            {[1, 2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count} Room{count > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-5 top-[2.4rem] h-4 w-4 text-ink/60" />
        </label>

        <label className="relative flex flex-col gap-1 rounded-[1.25rem] border border-ink/12 bg-linen p-5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">Adults</span>
          <select
            value={adults}
            onChange={(event) => onChangeAdults(Number(event.target.value))}
            className="bg-linen text-lg font-medium text-ink outline-none appearance-none"
            style={{ paddingRight: '2.5rem' }}
          >
            {[1, 2, 3, 4, 5, 6].map((count) => (
              <option key={count} value={count}>
                {count} Adult{count > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-5 top-[2.4rem] h-4 w-4 text-ink/60" />
        </label>

        <label className="relative flex flex-col gap-1 rounded-[1.25rem] border border-ink/12 bg-linen p-5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">Children</span>
          <select
            value={childrenCount}
            onChange={(event) => onChangeChildren(Number(event.target.value))}
            className="bg-linen text-lg font-medium text-ink outline-none appearance-none"
            style={{ paddingRight: '2.5rem' }}
          >
            {[0, 1, 2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count} Child{count === 1 ? '' : 'ren'}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-5 top-[2.4rem] h-4 w-4 text-ink/60" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <input
            value={promoCode}
            onChange={(event) => onChangePromoCode(event.target.value)}
            placeholder="Promo code"
            className="rounded-[1.25rem] border border-ink/12 bg-linen px-5 py-4 text-sm outline-none placeholder:text-ink/40"
          />
          <input
            value={groupCode}
            onChange={(event) => onChangeGroupCode(event.target.value)}
            placeholder="Group code"
            className="rounded-[1.25rem] border border-ink/12 bg-linen px-5 py-4 text-sm outline-none placeholder:text-ink/40"
          />
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-ink/12 pt-5">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-ink/50">
              {nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}, from` : 'Select your dates'}
            </p>
            <p className="text-2xl font-light">{nights > 0 ? formatMoney(total) : '—'}</p>
          </div>
        </div>

        <button
          type="button"
          disabled={!arrival || !departure}
          onClick={onContinue}
          className="mt-2 flex h-14 items-center justify-center gap-3 rounded-full bg-ink text-base font-bold text-linen transition enabled:hover:bg-palm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
