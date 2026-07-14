import { Check, ChevronLeft, ChevronRight, Mail, Phone, User } from 'lucide-react';
import { enhancements } from '../../../constants/bookingContent';

export type GuestDetails = {
  name: string;
  email: string;
  phone: string;
};

type DetailsStepProps = {
  selectedEnhancements: string[];
  onToggleEnhancement: (id: string) => void;
  guestDetails: GuestDetails;
  onChangeGuestDetails: (details: GuestDetails) => void;
  onBack: () => void;
  onContinue: () => void;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function DetailsStep({
  selectedEnhancements,
  onToggleEnhancement,
  guestDetails,
  onChangeGuestDetails,
  onBack,
  onContinue,
}: DetailsStepProps) {
  const nameValid = guestDetails.name.trim() !== '';
  const emailValid = isValidEmail(guestDetails.email);
  const canContinue = nameValid && emailValid;

  const enhancementsTotal = enhancements
    .filter((item) => selectedEnhancements.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="mx-auto max-w-[1680px] px-5 py-10 sm:px-8 lg:px-14">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-bold uppercase tracking-[0.1em] underline decoration-ink/30 underline-offset-4 hover:text-palm"
      >
        <ChevronLeft size={16} /> Back to room
      </button>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-palm">Enhancements</p>
            <span className="text-xs font-medium text-ink/45">
              {selectedEnhancements.length} of {enhancements.length} selected
            </span>
          </div>
          <p className="mt-1 text-sm text-ink/55">Optional extras to make your stay smoother.</p>

          <div className="mt-5 flex flex-col gap-3">
            {enhancements.map((item) => {
              const isSelected = selectedEnhancements.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggleEnhancement(item.id)}
                  className={`flex items-start gap-4 rounded-[1.25rem] border p-5 text-left transition ${
                    isSelected ? 'border-palm bg-palm/6' : 'border-ink/12 hover:border-ink/25'
                  }`}
                >
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${
                      isSelected ? 'bg-palm text-linen' : 'bg-ink/6 text-ink/50'
                    }`}
                  >
                    <item.icon size={19} strokeWidth={1.8} />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium">{item.label}</p>
                      <p className="shrink-0 text-sm font-bold">
                        {item.price > 0 ? `+PHP ${item.price.toLocaleString('en-PH')}` : 'Included'}
                      </p>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-ink/60">{item.description}</p>
                  </div>
                  <span
                    className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition ${
                      isSelected ? 'border-palm bg-palm text-linen' : 'border-ink/25 text-transparent'
                    }`}
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                </button>
              );
            })}
          </div>

          {enhancementsTotal > 0 ? (
            <div className="mt-4 flex items-center justify-between rounded-[1.25rem] bg-ink/5 px-5 py-4 text-sm">
              <span className="font-medium text-ink/70">Enhancements subtotal</span>
              <span className="font-bold">PHP {enhancementsTotal.toLocaleString('en-PH')}</span>
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-palm">Guest details</p>
          <p className="mt-1 text-sm text-ink/55">We'll send your confirmation here.</p>

          <div className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-ink/50">
                Full name <span className="text-palm">*</span>
              </span>
              <span className="relative">
                <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
                <input
                  value={guestDetails.name}
                  onChange={(event) => onChangeGuestDetails({ ...guestDetails, name: event.target.value })}
                  placeholder="Juan Dela Cruz"
                  className="w-full rounded-[1rem] border bg-linen border-ink/15 py-4 pl-11 pr-5 outline-none transition focus:border-ink placeholder:text-ink/35"
                />
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-ink/50">
                Email <span className="text-palm">*</span>
              </span>
              <span className="relative">
                <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
                <input
                  type="email"
                  value={guestDetails.email}
                  onChange={(event) => onChangeGuestDetails({ ...guestDetails, email: event.target.value })}
                  placeholder="you@email.com"
                  className={`w-full rounded-[1rem] bg-linen border py-4 pl-11 pr-5 outline-none transition placeholder:text-ink/35 ${
                    guestDetails.email && !emailValid ? 'border-coral/60 focus:border-coral' : 'border-ink/15 focus:border-ink'
                  }`}
                />
              </span>
              {guestDetails.email && !emailValid ? (
                <span className="text-xs text-coral">Enter a valid email address.</span>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-ink/50">Phone (optional)</span>
              <span className="relative">
                <Phone size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
                <input
                  type="tel"
                  value={guestDetails.phone}
                  onChange={(event) => onChangeGuestDetails({ ...guestDetails, phone: event.target.value })}
                  placeholder="+63 900 000 0000"
                  className="w-full rounded-[1rem] border bg-linen border-ink/15 py-4 pl-11 pr-5 outline-none transition focus:border-ink placeholder:text-ink/35"
                />
              </span>
            </label>
          </div>

          <div className="mt-8 flex flex-col items-end gap-2">
            <button
              type="button"
              disabled={!canContinue}
              onClick={onContinue}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ink text-base font-bold text-linen transition enabled:hover:bg-palm disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/35 sm:w-auto sm:px-8"
            >
              Continue
              <ChevronRight size={18} />
            </button>
            {!canContinue ? (
              <span className="text-xs text-ink/45">Enter your name and a valid email to continue.</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
