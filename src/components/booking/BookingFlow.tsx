import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { brandName, bookingFlowSteps } from '../../constants/landingContent';
import { useBookingFlow } from '../../context/BookingFlowContext';
import { CalendarStep } from './steps/CalendarStep';
import { RoomStep } from './steps/RoomStep';
import { DetailsStep, type GuestDetails } from './steps/DetailsStep';
import { ConfirmationStep } from './steps/ConfirmationStep';

const getPhpLabel = (currency = 'PHP', symbol = '₱') => `${currency} ${symbol}`;
const STEPS = bookingFlowSteps;

export function BookingFlow() {
  const { isOpen, close } = useBookingFlow();
  const [step, setStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);

  const [arrival, setArrival] = useState<Date | null>(null);
  const [departure, setDeparture] = useState<Date | null>(null);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([]);
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setMaxStepReached(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const goToStep = (nextStep: number) => {
    if (nextStep > maxStepReached) return;
    setStep(nextStep);
  };

  const advance = () => {
    const nextStep = Math.min(step + 1, STEPS.length);
    setStep(nextStep);
    setMaxStepReached((current) => Math.max(current, nextStep));
  };

  const toggleEnhancement = (id: string) => {
    setSelectedEnhancements((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex h-[100dvh] flex-col overflow-hidden bg-linen text-ink">
      <div className="shrink-0 border-b border-ink/10 bg-linen">
        <div className="mx-auto flex max-w-[1680px] items-center justify-between px-5 py-4 sm:px-8 lg:px-14">
          <button
            type="button"
            onClick={close}
            aria-label="Close booking"
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-ink hover:text-linen"
          >
            <X size={20} strokeWidth={2} />
          </button>
          <div className="flex items-center gap-3">
            <img className="h-11 w-11 object-contain sm:h-12 sm:w-12" src="/image/dphlogo.png" alt="Delightful Philippines logo" />
            <span className="brand-write font-brand text-2xl text-ink sm:text-3xl" aria-hidden="true">
              {brandName.split('').map((char, index) => (
                <span key={index} className="brand-letter" style={{ animationDelay: `${index * 0.05}s` }}>
                  {char === ' ' ? ' ' : char}
                </span>
              ))}
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">{getPhpLabel()}</span>
        </div>

        <div className="mx-auto max-w-[1680px] px-5 pb-4 sm:px-8 lg:px-14">
          <h1 className="text-center text-2xl font-light uppercase tracking-[0.15em]">Select your dates</h1>
          <div className="mt-4 flex items-center justify-center">
            {STEPS.map((item, index) => (
              <div key={item.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => goToStep(item.id)}
                  disabled={item.id > maxStepReached}
                  className="flex flex-col items-center gap-2 disabled:cursor-not-allowed"
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full border text-sm font-bold transition ${
                      item.id === step
                        ? 'border-ink bg-ink text-linen'
                        : item.id < step
                          ? 'border-ink text-ink'
                          : 'border-ink/25 text-ink/35'
                    }`}
                  >
                    {item.id}
                  </span>
                  <span
                    className={`hidden text-[0.65rem] font-bold uppercase tracking-[0.15em] sm:block ${
                      item.id <= step ? 'text-ink' : 'text-ink/35'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
                {index < STEPS.length - 1 ? (
                  <span className={`mx-3 h-px w-10 sm:w-24 ${item.id < step ? 'bg-ink' : 'bg-ink/20'}`} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {step === 1 ? (
          <CalendarStep
            arrival={arrival}
            departure={departure}
            onSelectRange={(nextArrival, nextDeparture) => {
              setArrival(nextArrival);
              setDeparture(nextDeparture);
            }}
            rooms={rooms}
            adults={adults}
            childrenCount={childrenCount}
            onChangeRooms={setRooms}
            onChangeAdults={setAdults}
            onChangeChildren={setChildrenCount}
            promoCode={promoCode}
            onChangePromoCode={setPromoCode}
            groupCode={groupCode}
            onChangeGroupCode={setGroupCode}
            onContinue={advance}
          />
        ) : null}

        {step === 2 ? (
          <RoomStep
            arrival={arrival}
            departure={departure}
            adults={adults}
            childrenCount={childrenCount}
            onChangeAdults={setAdults}
            onChangeChildren={setChildrenCount}
            onEditDates={() => setStep(1)}
            onSelectRoom={(id) => {
              setRoomId(id);
              advance();
            }}
          />
        ) : null}

        {step === 3 ? (
          <DetailsStep
            selectedEnhancements={selectedEnhancements}
            onToggleEnhancement={toggleEnhancement}
            guestDetails={guestDetails}
            onChangeGuestDetails={setGuestDetails}
            onBack={() => setStep(2)}
            onContinue={advance}
          />
        ) : null}

        {step === 4 ? (
          <div className="flex min-h-full flex-col justify-center">
            <ConfirmationStep
              arrival={arrival}
              departure={departure}
              rooms={rooms}
              adults={adults}
              childrenCount={childrenCount}
              roomId={roomId}
              selectedEnhancements={selectedEnhancements}
              guestDetails={guestDetails}
              onBack={() => setStep(3)}
              onClose={close}
            />
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
